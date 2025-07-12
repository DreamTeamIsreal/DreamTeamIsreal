import crypto from 'crypto';
import { EncryptedField, RecordIntegrityCheck } from '../types';
import { logger } from '../utils/logger';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

export class EncryptionService {
  private readonly encryptionKey: Buffer;
  private readonly hmacSecret: Buffer;
  private readonly recordIntegritySecret: Buffer;

  constructor() {
    const keyHex = process.env.ENCRYPTION_KEY;
    const hmacHex = process.env.HMAC_SECRET;
    const integritySecret = process.env.RECORD_INTEGRITY_SECRET;

    if (!keyHex || !hmacHex || !integritySecret) {
      throw new Error('Missing required encryption keys in environment variables');
    }

    this.encryptionKey = Buffer.from(keyHex, 'hex');
    this.hmacSecret = Buffer.from(hmacHex, 'hex');
    this.recordIntegritySecret = Buffer.from(integritySecret, 'utf8');

    if (this.encryptionKey.length !== KEY_LENGTH) {
      throw new Error(`Encryption key must be ${KEY_LENGTH} bytes (${KEY_LENGTH * 2} hex characters)`);
    }

    logger.info('Encryption service initialized successfully');
  }

  /**
   * Encrypt sensitive data using AES-256-CBC
   */
  encrypt(plaintext: string): EncryptedField {
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.encryptionKey, iv);
      cipher.setAutoPadding(true);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      return {
        encryptedData: encrypted,
        iv: iv.toString('hex')
      };
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt encrypted data
   */
  decrypt(encryptedField: EncryptedField): string {
    try {
      const iv = Buffer.from(encryptedField.iv, 'hex');
      const decipher = crypto.createDecipheriv(ALGORITHM, this.encryptionKey, iv);
      decipher.setAutoPadding(true);

      let decrypted = decipher.update(encryptedField.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Generate HMAC for data integrity
   */
  generateHMAC(data: string): string {
    return crypto
      .createHmac('sha256', this.hmacSecret)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify HMAC for data integrity
   */
  verifyHMAC(data: string, hmac: string): boolean {
    const expectedHmac = this.generateHMAC(data);
    return crypto.timingSafeEqual(
      Buffer.from(hmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
  }

  /**
   * CRITICAL SECURITY FEATURE: Generate metadata tag for real vs fake data identification
   * This creates a cryptographic signature that allows the application to identify
   * which records are real vs fake, even if an attacker has full database access
   */
  generateRecordIntegrityTag(recordData: any, isReal: boolean): string {
    try {
      // Create a deterministic identifier for the record
      const recordId = this.createRecordFingerprint(recordData);
      
      // Generate the integrity check data
      const integrityData = {
        recordId,
        isReal,
        timestamp: Date.now(),
        checksum: this.generateHMAC(JSON.stringify(recordData))
      };

      // Create MAC (Message Authentication Code) for the integrity data
      const mac = crypto
        .createHmac('sha256', this.recordIntegritySecret)
        .update(JSON.stringify(integrityData))
        .digest('hex');

      // Encrypt the integrity check data
      const encryptedIntegrityData = this.encrypt(JSON.stringify({
        ...integrityData,
        mac
      }));

      return JSON.stringify(encryptedIntegrityData);
    } catch (error) {
      logger.error('Failed to generate record integrity tag:', error);
      throw new Error('Failed to generate record integrity tag');
    }
  }

  /**
   * CRITICAL SECURITY FEATURE: Verify if a record is real or fake
   * Returns true only for legitimate records created by the application
   */
  verifyRecordIntegrity(metadataTag: string, recordData: any): RecordIntegrityCheck {
    try {
      // Parse and decrypt the metadata tag
      const encryptedIntegrityData: EncryptedField = JSON.parse(metadataTag);
      const decryptedData = this.decrypt(encryptedIntegrityData);
      const integrityCheck = JSON.parse(decryptedData);

      // Verify the MAC
      const verificationData = {
        recordId: integrityCheck.recordId,
        isReal: integrityCheck.isReal,
        timestamp: integrityCheck.timestamp,
        checksum: integrityCheck.checksum
      };

      const expectedMac = crypto
        .createHmac('sha256', this.recordIntegritySecret)
        .update(JSON.stringify(verificationData))
        .digest('hex');

      const isValidMac = crypto.timingSafeEqual(
        Buffer.from(integrityCheck.mac, 'hex'),
        Buffer.from(expectedMac, 'hex')
      );

      if (!isValidMac) {
        return { isReal: false, mac: 'invalid' };
      }

      // Verify the record fingerprint matches
      const currentFingerprint = this.createRecordFingerprint(recordData);
      if (currentFingerprint !== integrityCheck.recordId) {
        return { isReal: false, mac: 'fingerprint_mismatch' };
      }

      // Verify the data checksum
      const currentChecksum = this.generateHMAC(JSON.stringify(recordData));
      if (currentChecksum !== integrityCheck.checksum) {
        return { isReal: false, mac: 'checksum_mismatch' };
      }

      return {
        isReal: integrityCheck.isReal,
        mac: integrityCheck.mac
      };
    } catch (error) {
      logger.warn('Record integrity verification failed:', error);
      return { isReal: false, mac: 'verification_failed' };
    }
  }

  /**
   * Create a unique fingerprint for a record based on its essential data
   */
  private createRecordFingerprint(recordData: any): string {
    // Create a deterministic identifier based on the record's essential fields
    // Exclude metadata and timestamp fields to focus on core data
    const essentialData = { ...recordData };
    delete essentialData.id;
    delete essentialData.createdAt;
    delete essentialData.updatedAt;
    delete essentialData.metadataTag;

    return crypto
      .createHash('sha256')
      .update(JSON.stringify(essentialData))
      .digest('hex');
  }

  /**
   * Generate anonymous user hash ID for quiz answers and supporters
   * This allows linking records to users without exposing user identity
   */
  generateAnonymousUserHash(userId: string, context: string): string {
    return crypto
      .createHmac('sha256', this.recordIntegritySecret)
      .update(`${userId}:${context}`)
      .digest('hex');
  }

  /**
   * Verify anonymous user hash
   */
  verifyAnonymousUserHash(userId: string, context: string, hash: string): boolean {
    const expectedHash = this.generateAnonymousUserHash(userId, context);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }
}

// Singleton instance
export const encryptionService = new EncryptionService();