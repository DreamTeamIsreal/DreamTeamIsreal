/**
 * Logger Utility for DreamTeamIsrael Platform
 * 
 * Provides structured logging with different levels and production-ready features.
 * Replaces console.log statements with configurable, professional logging.
 * 
 * Features:
 * - Different log levels (debug, info, warn, error)
 * - Environment-based configuration
 * - Structured logging with context
 * - Error reporting integration ready
 * - Performance tracking
 * - Memory-safe logging
 */

// ================================
// TYPES AND INTERFACES
// ================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  stack?: string;
  component?: string;
  userId?: string;
  sessionId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  enableErrorReporting: boolean;
  environment: 'development' | 'production' | 'test';
}

// ================================
// LOGGER CLASS
// ================================

class Logger {
  private config: LoggerConfig;
  private storage: LogEntry[] = [];
  private sessionId: string;

  constructor(config?: Partial<LoggerConfig>) {
    // Default configuration
    this.config = {
      level: 'info',
      enableConsole: true,
      enableStorage: true,
      maxStorageEntries: 100,
      enableErrorReporting: false,
      environment: (typeof window !== 'undefined' && window.location?.hostname === 'localhost') ? 'development' : 'production',
      ...config
    };

    // Generate session ID
    this.sessionId = this.generateSessionId();

    // Set production defaults
    if (this.config.environment === 'production') {
      this.config.level = 'warn';
      this.config.enableConsole = false;
      this.config.enableErrorReporting = true;
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get numeric level for comparison
   */
  private getLevelWeight(level: LogLevel): number {
    const weights = { debug: 0, info: 1, warn: 2, error: 3 };
    return weights[level];
  }

  /**
   * Check if log level should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    return this.getLevelWeight(level) >= this.getLevelWeight(this.config.level);
  }

  /**
   * Format timestamp in ISO format
   */
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Create log entry object
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: this.formatTimestamp(),
      sessionId: this.sessionId,
    };

    if (context) entry.context = context;
    if (error) {
      entry.error = error;
      entry.stack = error.stack;
    }
    if (component) entry.component = component;

    return entry;
  }

  /**
   * Store log entry in memory
   */
  private storeEntry(entry: LogEntry): void {
    if (!this.config.enableStorage) return;

    this.storage.push(entry);

    // Limit storage size to prevent memory leaks
    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage.shift();
    }
  }

  /**
   * Output to console with appropriate styling
   */
  private outputToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const { level, message, context, error, component, timestamp } = entry;
    
    // Format message with component
    const formattedMessage = component 
      ? `[${component}] ${message}`
      : message;

    // Choose console method and styling
    switch (level) {
      case 'debug':
        console.debug(`🔍 ${timestamp} - ${formattedMessage}`, context || '');
        break;
      case 'info':
        console.info(`ℹ️ ${timestamp} - ${formattedMessage}`, context || '');
        break;
      case 'warn':
        console.warn(`⚠️ ${timestamp} - ${formattedMessage}`, context || '');
        if (error) console.warn('Error details:', error);
        break;
      case 'error':
        console.error(`❌ ${timestamp} - ${formattedMessage}`, context || '');
        if (error) console.error('Error details:', error);
        break;
    }
  }

  /**
   * Report error to external service (when enabled)
   */
  private reportError(entry: LogEntry): void {
    if (!this.config.enableErrorReporting || entry.level !== 'error') return;

    // In production, this would integrate with services like:
    // - Sentry: Sentry.captureException(entry.error, { extra: entry.context })
    // - LogRocket: LogRocket.captureException(entry.error)
    // - Custom API: fetch('/api/errors', { method: 'POST', body: JSON.stringify(entry) })
    
    if (this.config.environment === 'development') {
      console.log('📊 Error would be reported to monitoring service:', entry);
    }
  }

  /**
   * Main logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error, component);
    
    this.storeEntry(entry);
    this.outputToConsole(entry);
    this.reportError(entry);
  }

  // ================================
  // PUBLIC LOGGING METHODS
  // ================================

  /**
   * Debug level logging (development only)
   */
  debug(message: string, context?: Record<string, any>, component?: string): void {
    this.log('debug', message, context, undefined, component);
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, any>, component?: string): void {
    this.log('info', message, context, undefined, component);
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, any>, component?: string): void {
    this.log('warn', message, context, undefined, component);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: Record<string, any>, component?: string): void {
    this.log('error', message, context, error, component);
  }

  // ================================
  // SPECIALIZED LOGGING METHODS
  // ================================

  /**
   * Log API requests
   */
  apiRequest(method: string, url: string, context?: Record<string, any>): void {
    this.info(`API Request: ${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      ...context
    }, 'API');
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, url: string, status: number, duration?: number): void {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    this.log(level, `API Response: ${method} ${url} - ${status}`, {
      type: 'api_response',
      method,
      url,
      status,
      duration
    }, undefined, 'API');
  }

  /**
   * Log user actions
   */
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User Action: ${action}`, {
      type: 'user_action',
      action,
      ...context
    }, 'User');
  }

  /**
   * Log component lifecycle events
   */
  componentEvent(component: string, event: string, context?: Record<string, any>): void {
    this.debug(`Component ${event}: ${component}`, {
      type: 'component_event',
      component,
      event,
      ...context
    }, component);
  }

  /**
   * Log performance metrics
   */
  performance(name: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${name} took ${duration}ms`, {
      type: 'performance',
      name,
      duration,
      ...context
    }, 'Performance');
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Get all stored log entries
   */
  getStoredLogs(): LogEntry[] {
    return [...this.storage];
  }

  /**
   * Clear stored logs
   */
  clearStoredLogs(): void {
    this.storage = [];
  }

  /**
   * Export logs as JSON string
   */
  exportLogs(): string {
    return JSON.stringify(this.storage, null, 2);
  }

  /**
   * Get logger configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Update logger configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Create performance timer
   */
  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.performance(name, duration);
    };
  }
}

// ================================
// SINGLETON INSTANCE
// ================================

export const logger = new Logger();

// ================================
// CONVENIENCE FUNCTIONS
// ================================

/**
 * Quick debug logging
 */
export const logDebug = (message: string, context?: Record<string, any>, component?: string) => {
  logger.debug(message, context, component);
};

/**
 * Quick info logging
 */
export const logInfo = (message: string, context?: Record<string, any>, component?: string) => {
  logger.info(message, context, component);
};

/**
 * Quick warning logging
 */
export const logWarn = (message: string, contextOrError?: Record<string, any> | Error, component?: string) => {
  logger.warn(message, contextOrError, component);
};

/**
 * Quick error logging
 */
export const logError = (message: string, error?: Error, context?: Record<string, any>, component?: string) => {
  logger.error(message, error, context, component);
};

/**
 * Log API calls
 */
export const logAPI = {
  request: (method: string, url: string, context?: Record<string, any>) => 
    logger.apiRequest(method, url, context),
  response: (method: string, url: string, status: number, duration?: number) =>
    logger.apiResponse(method, url, status, duration)
};

/**
 * Log user interactions
 */
export const logUser = (action: string, context?: Record<string, any>) => {
  logger.userAction(action, context);
};

/**
 * Performance timing utility
 */
export const timeFunction = <T>(name: string, fn: () => T): T => {
  const stopTimer = logger.startTimer(name);
  try {
    const result = fn();
    stopTimer();
    return result;
  } catch (error) {
    stopTimer();
    logger.error(`Error in timed function ${name}`, error as Error);
    throw error;
  }
};

// ================================
// CONSOLE REPLACEMENT UTILITIES
// ================================

/**
 * Replace console.log with structured logging
 */
export const replaceConsole = () => {
  if (typeof window !== 'undefined') {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info
    };

    console.log = (...args) => {
      logger.info(args.join(' '), { args });
    };

    console.warn = (...args) => {
      logger.warn(args.join(' '), { args });
    };

    console.error = (...args) => {
      logger.error(args.join(' '), undefined, { args });
    };

    console.debug = (...args) => {
      logger.debug(args.join(' '), { args });
    };

    console.info = (...args) => {
      logger.info(args.join(' '), { args });
    };

    // Store original for restoration
    (window as any).__originalConsole = originalConsole;
  }
};

/**
 * Restore original console methods
 */
export const restoreConsole = () => {
  if (typeof window !== 'undefined' && (window as any).__originalConsole) {
    const original = (window as any).__originalConsole;
    console.log = original.log;
    console.warn = original.warn;
    console.error = original.error;
    console.debug = original.debug;
    console.info = original.info;
    delete (window as any).__originalConsole;
  }
};

export default logger;