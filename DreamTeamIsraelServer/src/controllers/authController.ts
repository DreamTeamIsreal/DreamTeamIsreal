import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { encryptionService } from '../services/encryption';
import { fakeDataService } from '../services/fakeDataService';
import { query, withTransaction } from '../config/database';
import { logger, securityLogger } from '../utils/logger';
import crypto from 'crypto';

export class AuthController {

  /**
   * User registration with fake data generation
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { israelId, fullName, dateOfBirth, mobilePhoneNumber, email, city, password } = req.body;

      // Validate input data
      const validation = authService.validateRegistrationData(req.body);
      if (!validation.isValid) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.errors
        });
        return;
      }

      // Check if user already exists
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User already exists'
        });
        return;
      }

      // Create the real user record
      const userId = crypto.randomUUID();
      const passwordHash = await authService.hashPassword(password);

      const realUserData = {
        id: userId,
        israelId,
        fullName,
        dateOfBirth,
        mobilePhoneNumber,
        email,
        city,
        passwordHash,
        mfaSecret: undefined,
        mfaEnabled: false,
        roles: ['voter'] as any[],
        emailVerified: false,
        phoneVerified: false
      };

      // Encrypt sensitive fields
      const encryptedUserData = {
        ...realUserData,
        israelId: JSON.stringify(encryptionService.encrypt(israelId)),
        fullName: JSON.stringify(encryptionService.encrypt(fullName)),
        dateOfBirth: JSON.stringify(encryptionService.encrypt(dateOfBirth)),
        mobilePhoneNumber: JSON.stringify(encryptionService.encrypt(mobilePhoneNumber)),
        email: JSON.stringify(encryptionService.encrypt(email)),
        city: JSON.stringify(encryptionService.encrypt(city)),
        metadataTag: encryptionService.generateRecordIntegrityTag(realUserData.id, true) // Pass realUserData.id for integrity tag
      };

      // Generate fake user records - UPDATED LINE
      const fakeUsers = fakeDataService.generateFakeRecords(realUserData.id, 'user');

      // Insert all records (real + fake) in a transaction
      await withTransaction(async (client) => {
        // Insert real user
        await client.query(`
          INSERT INTO users (
            id, israel_id, full_name, date_of_birth, mobile_phone_number,
            email, city, password_hash, mfa_secret, mfa_enabled, roles,
            email_verified, phone_verified, metadata_tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          encryptedUserData.id, encryptedUserData.israelId, encryptedUserData.fullName,
          encryptedUserData.dateOfBirth, encryptedUserData.mobilePhoneNumber,
          encryptedUserData.email, encryptedUserData.city, encryptedUserData.passwordHash,
          encryptedUserData.mfaSecret, encryptedUserData.mfaEnabled, encryptedUserData.roles,
          encryptedUserData.emailVerified, encryptedUserData.phoneVerified, encryptedUserData.metadataTag
        ]);

        // Insert fake users
        for (const fakeUser of fakeUsers) {
          await client.query(`
            INSERT INTO users (
              id, israel_id, full_name, date_of_birth, mobile_phone_number,
              email, city, password_hash, mfa_secret, mfa_enabled, roles,
              email_verified, phone_verified, metadata_tag
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          `, [
            fakeUser.id, fakeUser.israelId, fakeUser.fullName,
            fakeUser.dateOfBirth, fakeUser.mobilePhoneNumber,
            fakeUser.email, fakeUser.city, fakeUser.passwordHash,
            fakeUser.mfaSecret, fakeUser.mfaEnabled, fakeUser.roles,
            fakeUser.emailVerified, fakeUser.phoneVerified, fakeUser.metadata_tag // Note: metadata_tag here
          ]);
        }
      });

      // Log fake data generation - UPDATED LINE
      fakeDataService.logFakeDataGeneration('user_registration', 1, fakeUsers.length);

      logger.info('User registered successfully', { userId, email: email.replace(/(.{2}).*@/, '$1***@') });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          userId,
          requiresEmailVerification: true
        }
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  }

  /**
   * User login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const ip = req.ip || 'unknown';

      const authResult = await authService.authenticateUser(email, password, ip);

      if (!authResult) {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
        return;
      }

      const { user, requiresMFA } = authResult;

      if (requiresMFA) {
        // Return partial token for MFA completion
        const partialToken = authService.generateToken({
          userId: user.id,
          email: user.email,
          roles: ['voter'] as any[] // Temporary role for MFA pending
        });

        res.json({
          success: true,
          requiresMFA: true,
          partialToken,
          message: 'MFA required'
        });
      } else {
        // Generate full access tokens
        const tokens = authService.generateTokensForUser(user);

        res.json({
          success: true,
          requiresMFA: false,
          data: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              roles: user.roles,
              mfaEnabled: user.mfaEnabled
            }
          }
        });
      }

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  }

  /**
   * MFA setup
   */
  async setupMFA(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const user = await authService.findUserById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const mfaSetup = authService.setupMFA(user.id, user.email);

      // Store the secret temporarily (user needs to verify before enabling)
      await query(`
        UPDATE users SET mfa_secret = $1 WHERE id = $2
      `, [mfaSetup.secret, user.id]);

      res.json({
        success: true,
        data: {
          secret: mfaSetup.secret,
          qrCodeUrl: mfaSetup.qrCodeUrl,
          manualEntryKey: mfaSetup.manualEntryKey
        }
      });

    } catch (error) {
      logger.error('MFA setup error:', error);
      res.status(500).json({
        success: false,
        error: 'MFA setup failed'
      });
    }
  }

  /**
   * Verify MFA and complete login
   */
  async verifyMFA(req: Request, res: Response): Promise<void> {
    try {
      const { userId, mfaCode } = req.body;
      const ip = req.ip || 'unknown';

      const isValidMFA = await authService.authenticateMFA(userId, mfaCode, ip);

      if (!isValidMFA) {
        res.status(401).json({
          success: false,
          error: 'Invalid MFA code'
        });
        return;
      }

      const user = await authService.findUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Generate full access tokens
      const tokens = authService.generateTokensForUser(user);

      res.json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles,
            mfaEnabled: user.mfaEnabled
          }
        }
      });

    } catch (error) {
      logger.error('MFA verification error:', error);
      res.status(500).json({
        success: false,
        error: 'MFA verification failed'
      });
    }
  }

  /**
   * Enable MFA after verification
   */
  async enableMFA(req: Request, res: Response): Promise<void> {
    try {
      const { mfaCode } = req.body;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const user = await authService.findUserById(req.user.userId);
      if (!user || !user.mfaSecret) {
        res.status(400).json({
          success: false,
          error: 'MFA setup required first'
        });
        return;
      }

      const isValidMFA = authService.verifyMFA(user.mfaSecret, mfaCode);
      if (!isValidMFA) {
        res.status(401).json({
          success: false,
          error: 'Invalid MFA code'
        });
        return;
      }

      // Enable MFA for the user
      await query(`
        UPDATE users SET mfa_enabled = true WHERE id = $1
      `, [user.id]);

      securityLogger.dataAccess(user.id, 'mfa_enabled', 'UPDATE', req.ip || 'unknown');

      res.json({
        success: true,
        message: 'MFA enabled successfully'
      });

    } catch (error) {
      logger.error('MFA enable error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to enable MFA'
      });
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token required'
        });
        return;
      }

      const payload = authService.verifyRefreshToken(refreshToken);
      if (!payload) {
        res.status(401).json({
          success: false,
          error: 'Invalid refresh token'
        });
        return;
      }

      const user = await authService.findUserById(payload.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      const tokens = authService.generateTokensForUser(user);

      res.json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });

    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Token refresh failed'
      });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
        return;
      }

      const user = await authService.findUserById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          city: user.city,
          roles: user.roles,
          mfaEnabled: user.mfaEnabled,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }
      });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  }
}

export const authController = new AuthController();