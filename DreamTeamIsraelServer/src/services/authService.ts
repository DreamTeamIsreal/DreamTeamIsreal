import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { User, AuthTokenPayload, MFASetupResponse } from '../types';
import { encryptionService } from './encryption';
import { query } from '../config/database';
import { logger, securityLogger } from '../utils/logger';

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET!;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error('Missing JWT secrets in environment variables');
    }
  }

  /**
   * Hash password with bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'dreamteam-israel',
      audience: 'dreamteam-users'
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
      issuer: 'dreamteam-israel',
      audience: 'dreamteam-users'
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'dreamteam-israel',
        audience: 'dreamteam-users'
      }) as AuthTokenPayload;
    } catch (error) {
      logger.warn('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, this.jwtRefreshSecret, {
        issuer: 'dreamteam-israel',
        audience: 'dreamteam-users'
      }) as AuthTokenPayload;
    } catch (error) {
      logger.warn('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Setup MFA for user
   */
  setupMFA(userId: string, userEmail: string): MFASetupResponse {
    const secret = speakeasy.generateSecret({
      name: `DreamTeamIsrael (${userEmail})`,
      issuer: process.env.MFA_ISSUER || 'DreamTeamIsrael',
      length: 32
    });

    const qrCodeUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: userEmail,
      issuer: process.env.MFA_ISSUER || 'DreamTeamIsrael',
      encoding: 'ascii'
    });

    return {
      secret: secret.base32,
      qrCodeUrl,
      manualEntryKey: secret.base32
    };
  }

  /**
   * Verify MFA token
   */
  verifyMFA(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
      window: 2, // Allow 2 time steps tolerance
      time: Math.floor(Date.now() / 1000)
    });
  }

  /**
   * Find user by email (filters out fake records)
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      // Search all users (real and fake) and filter
      const result = await query(`
        SELECT * FROM users 
        WHERE email LIKE $1
      `, [`%${email}%`]);

      // Filter out fake records by verifying metadata tags
      for (const row of result.rows) {
        try {
          // Decrypt email to check exact match
          const encryptedEmail = JSON.parse(row.email);
          const decryptedEmail = encryptionService.decrypt(encryptedEmail);
          
          if (decryptedEmail === email) {
            // Verify this is a real record
            const integrityCheck = encryptionService.verifyRecordIntegrity(
              row.metadata_tag,
              {
                israelId: row.israel_id,
                fullName: row.full_name,
                dateOfBirth: row.date_of_birth,
                mobilePhoneNumber: row.mobile_phone_number,
                email: row.email,
                city: row.city,
                passwordHash: row.password_hash,
                mfaSecret: row.mfa_secret,
                mfaEnabled: row.mfa_enabled,
                roles: row.roles,
                emailVerified: row.email_verified,
                phoneVerified: row.phone_verified
              }
            );

            if (integrityCheck.isReal) {
              return this.mapRowToUser(row);
            }
          }
        } catch (error) {
          // This record is likely fake or corrupted, skip it
          continue;
        }
      }

      return null;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Find user by ID (filters out fake records)
   */
  async findUserById(userId: string): Promise<User | null> {
    try {
      const result = await query(`
        SELECT * FROM users WHERE id = $1
      `, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      
      // Verify this is a real record
      const integrityCheck = encryptionService.verifyRecordIntegrity(
        row.metadata_tag,
        {
          israelId: row.israel_id,
          fullName: row.full_name,
          dateOfBirth: row.date_of_birth,
          mobilePhoneNumber: row.mobile_phone_number,
          email: row.email,
          city: row.city,
          passwordHash: row.password_hash,
          mfaSecret: row.mfa_secret,
          mfaEnabled: row.mfa_enabled,
          roles: row.roles,
          emailVerified: row.email_verified,
          phoneVerified: row.phone_verified
        }
      );

      if (integrityCheck.isReal) {
        return this.mapRowToUser(row);
      }

      return null;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw new Error('Database error while finding user');
    }
  }

  /**
   * Map database row to User object with decryption
   */
  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      israelId: encryptionService.decrypt(JSON.parse(row.israel_id)),
      fullName: encryptionService.decrypt(JSON.parse(row.full_name)),
      dateOfBirth: encryptionService.decrypt(JSON.parse(row.date_of_birth)),
      mobilePhoneNumber: encryptionService.decrypt(JSON.parse(row.mobile_phone_number)),
      email: encryptionService.decrypt(JSON.parse(row.email)),
      city: encryptionService.decrypt(JSON.parse(row.city)),
      passwordHash: row.password_hash,
      mfaSecret: row.mfa_secret,
      mfaEnabled: row.mfa_enabled,
      roles: row.roles,
      emailVerified: row.email_verified,
      phoneVerified: row.phone_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      metadataTag: row.metadata_tag
    };
  }

  /**
   * Authenticate user with email/password
   */
  async authenticateUser(email: string, password: string, ip: string): Promise<{ user: User; requiresMFA: boolean } | null> {
    try {
      securityLogger.loginAttempt(email, false, ip); // Log attempt first

      const user = await this.findUserByEmail(email);
      if (!user) {
        return null;
      }

      const isValidPassword = await this.verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return null;
      }

      securityLogger.loginAttempt(email, true, ip); // Log successful authentication
      
      return {
        user,
        requiresMFA: user.mfaEnabled
      };
    } catch (error) {
      logger.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  }

  /**
   * Authenticate MFA
   */
  async authenticateMFA(userId: string, mfaToken: string, ip: string): Promise<boolean> {
    try {
      const user = await this.findUserById(userId);
      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        securityLogger.mfaAttempt(userId, false, ip);
        return false;
      }

      const isValidMFA = this.verifyMFA(user.mfaSecret, mfaToken);
      securityLogger.mfaAttempt(userId, isValidMFA, ip);
      
      return isValidMFA;
    } catch (error) {
      logger.error('MFA authentication error:', error);
      securityLogger.mfaAttempt(userId, false, ip);
      return false;
    }
  }

  /**
   * Generate tokens for authenticated user
   */
  generateTokensForUser(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      roles: user.roles
    };

    return {
      accessToken: this.generateToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Validate user registration data
   */
  validateRegistrationData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Israel ID validation (9 digits)
    if (!data.israelId || !/^\d{9}$/.test(data.israelId)) {
      errors.push('Invalid Israel ID format');
    }

    // Email validation
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    // Phone validation (Israeli format)
    if (!data.mobilePhoneNumber || !/^05\d{8}$/.test(data.mobilePhoneNumber)) {
      errors.push('Invalid mobile phone number format');
    }

    // Password validation
    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // Name validation
    if (!data.fullName || data.fullName.trim().length < 2) {
      errors.push('Full name is required');
    }

    // Date of birth validation
    if (!data.dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 120) {
        errors.push('Age must be between 18 and 120 years');
      }
    }

    // City validation
    if (!data.city || data.city.trim().length < 2) {
      errors.push('City is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const authService = new AuthService();