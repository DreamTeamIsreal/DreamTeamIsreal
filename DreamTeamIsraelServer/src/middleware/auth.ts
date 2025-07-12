import { Request, Response, NextFunction } from 'express';
import { AuthTokenPayload, UserRole } from '../types';
import { authService } from '../services/authService';
import { logger, securityLogger } from '../utils/logger';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = authService.verifyToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Log access for security monitoring
    securityLogger.dataAccess(
      payload.userId,
      req.path,
      req.method,
      req.ip || 'unknown'
    );

    req.user = payload;
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (requiredRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const userRoles = req.user.roles;
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      securityLogger.suspiciousActivity({
        action: 'unauthorized_access_attempt',
        userId: req.user.userId,
        requiredRoles,
        userRoles,
        path: req.path
      }, req.ip || 'unknown');

      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication - sets user if token is valid but doesn't require it
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = authService.verifyToken(token);
      
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth - just log and continue
    logger.debug('Optional auth failed:', error);
    next();
  }
};

/**
 * Admin only middleware
 */
export const adminOnly = [
  authenticate,
  authorize(['admin'])
];

/**
 * Voter or higher middleware
 */
export const voterOrHigher = [
  authenticate,
  authorize(['voter', 'candidate', 'admin'])
];

/**
 * Candidate or higher middleware
 */
export const candidateOrHigher = [
  authenticate,
  authorize(['candidate', 'admin'])
];