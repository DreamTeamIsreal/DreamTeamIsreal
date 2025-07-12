import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for removing sensitive data from logs
const sanitizeFormat = winston.format((info) => {
  // Remove sensitive fields from log messages
  const sensitiveFields = [
    'password', 'passwordHash', 'token', 'secret', 'key',
    'israelId', 'mobilePhoneNumber', 'email', 'encryptedData',
    'metadataTag', 'mfaSecret'
  ];
  
  if (typeof info.message === 'object' && info.message !== null) {
    const messageObj = info.message as Record<string, any>;
    sensitiveFields.forEach(field => {
      if (messageObj[field]) {
        messageObj[field] = '[REDACTED]';
      }
    });
  }
  
  return info;
});

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    sanitizeFormat(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'dreamteam-server' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Security audit logs
    new winston.transports.File({
      filename: path.join(logsDir, 'security.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Security event logger
export const securityLogger = {
  loginAttempt: (email: string, success: boolean, ip: string) => {
    logger.warn('Login attempt', { 
      email: email.replace(/(.{2}).*@/, '$1***@'), 
      success, 
      ip,
      type: 'AUTH_ATTEMPT'
    });
  },
  
  mfaAttempt: (userId: string, success: boolean, ip: string) => {
    logger.warn('MFA attempt', { 
      userId, 
      success, 
      ip,
      type: 'MFA_ATTEMPT'
    });
  },
  
  dataAccess: (userId: string, resource: string, action: string, ip: string) => {
    logger.info('Data access', { 
      userId, 
      resource, 
      action, 
      ip,
      type: 'DATA_ACCESS'
    });
  },
  
  suspiciousActivity: (details: any, ip: string) => {
    logger.error('Suspicious activity detected', { 
      details, 
      ip,
      type: 'SUSPICIOUS_ACTIVITY'
    });
  },
  
  fakeDataQuery: (userId: string, operation: string, fakeRecordsFiltered: number) => {
    logger.info('Fake data filtering', {
      userId,
      operation,
      fakeRecordsFiltered,
      type: 'FAKE_DATA_FILTER'
    });
  }
};