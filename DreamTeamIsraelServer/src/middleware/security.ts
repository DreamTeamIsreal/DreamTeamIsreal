// src/security.ts
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult, ValidationChain } from 'express-validator';
import { logger, securityLogger } from '../utils/logger';

/**
 * Rate limiting configurations
 */
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message || 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      securityLogger.suspiciousActivity({
        action: 'rate_limit_exceeded',
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent')
      }, req.ip || 'unknown');

      res.status(429).json({
        success: false,
        error: message || 'Too many requests, please try again later'
      });
    }
  });
};

// Different rate limits for different endpoints
export const generalRateLimit = createRateLimit(
    parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    'Too many requests from this IP'
);

export const authRateLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 login attempts
    'Too many login attempts, please try again later'
);

export const registrationRateLimit = createRateLimit(
    60 * 60 * 1000, // 1 hour
    3, // 3 registrations
    'Too many registration attempts, please try again later'
);

export const mfaRateLimit = createRateLimit(
    5 * 60 * 1000, // 5 minutes
    10, // 10 MFA attempts
    'Too many MFA attempts, please try again later'
);

/**
 * Helmet security headers
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * Input validation helpers
 */
export const validateInput = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Changed return type to Promise<void>
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      securityLogger.suspiciousActivity({
        action: 'validation_failed',
        path: req.path,
        errors: errors.array(),
        body: req.body
      }, req.ip || 'unknown');

      res.status(400).json({ // This sends the response and effectively ends the middleware chain for this request
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return; // Added return to explicitly exit the function after sending response
    }

    next(); // Only call next() if validation passes
  };
};

/**
 * Common validation rules
 */
export const registrationValidation = [
  body('israelId')
      .isLength({ min: 9, max: 9 })
      .isNumeric()
      .withMessage('Israel ID must be exactly 9 digits'),

  body('fullName')
      .isLength({ min: 2, max: 100 })
      .trim()
      .escape()
      .withMessage('Full name must be between 2-100 characters'),

  body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),

  body('mobilePhoneNumber')
      .matches(/^05\d{8}$/)
      .withMessage('Valid Israeli mobile phone number required'),

  body('city')
      .isLength({ min: 2, max: 50 })
      .trim()
      .escape()
      .withMessage('City must be between 2-50 characters'),

  body('password')
      .isLength({ min: 8, max: 128 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must be 8+ chars with uppercase, lowercase, number, and special char'),

  body('dateOfBirth')
      .isISO8601()
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || age > 120) {
          throw new Error('Age must be between 18 and 120');
        }
        return true;
      })
];

export const loginValidation = [
  body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),

  body('password')
      .isLength({ min: 1 })
      .withMessage('Password required')
];

export const mfaValidation = [
  body('mfaCode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('MFA code must be 6 digits')
];

export const quizAnswerValidation = [
  body('answers')
      .isArray({ min: 1, max: 100 })
      .withMessage('Answers array required'),

  body('answers.*.questionId')
      .isUUID()
      .withMessage('Valid question ID required'),

  body('answers.*.answer')
      .isInt({ min: 1, max: 5 })
      .withMessage('Answer must be between 1-5')
];

/**
 * CORS configuration for development
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      securityLogger.suspiciousActivity({
        action: 'cors_violation',
        origin,
        allowedOrigins
      }, 'unknown');

      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.userId // Cast req to any to access req.user
    });
  });

  next();
};

/**
 * Error handling middleware
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.userId // Cast req to any to access req.user
  });

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(err.status || 500).json({
    success: false,
    error: message
  });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('404 Not Found:', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
};