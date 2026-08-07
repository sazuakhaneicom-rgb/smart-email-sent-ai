import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

// Start cron jobs
import './cron/scheduled-campaigns.cron';
import './cron/domain-recheck.cron';

// Start BullMQ processors (only if Redis is configured)
import './jobs/send-campaign.processor';
import './jobs/import-contacts.processor';

const server = app.listen(config.port, () => {
  logger.info(`🚀 Smart Email Sent AI API running on port ${config.port}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`📡 Frontend URL: ${config.frontendUrl}`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default server;
