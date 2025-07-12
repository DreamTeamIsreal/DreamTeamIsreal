import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection, closePool } from './config/database';
import { logger } from './utils/logger';
import { 
  securityHeaders, 
  generalRateLimit, 
  corsOptions, 
  requestLogger, 
  errorHandler, 
  notFoundHandler 
} from './middleware/security';

// Import routes
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import dreamTeamRoutes from './routes/dreamTeam';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(requestLogger);

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DreamTeamIsrael API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/dreamteam', dreamTeamRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database');
      process.exit(1);
    }

    // Start listening
    app.listen(PORT, () => {
      logger.info(`DreamTeamIsrael API server started on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('Security features enabled:');
      logger.info('  ✓ Data encryption at rest');
      logger.info('  ✓ Real vs fake data obfuscation');
      logger.info('  ✓ JWT authentication');
      logger.info('  ✓ MFA support');
      logger.info('  ✓ Rate limiting');
      logger.info('  ✓ Security headers');
      logger.info('  ✓ Input validation');
      logger.info('  ✓ Comprehensive logging');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await closePool();
    logger.info('Database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

export default app;