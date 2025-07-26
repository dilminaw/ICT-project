import express from 'express';
import { body, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../services/logger.js';

const router = express.Router();

// POST /api/logs/client - Receive client-side logs
router.post('/client', [
  body('level').isIn(['INFO', 'WARN', 'ERROR', 'DEBUG']).withMessage('Invalid log level'),
  body('message').notEmpty().withMessage('Message is required'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp format')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { level, message, timestamp, url, userAgent, ...meta } = req.body;
  
  // Add client log context
  const clientLogData = {
    source: 'client',
    clientUrl: url,
    clientUserAgent: userAgent,
    userId: req.user?.id || 'anonymous',
    serverTimestamp: new Date().toISOString(),
    clientTimestamp: timestamp,
    ...meta
  };

  // Log using appropriate level
  switch (level.toLowerCase()) {
    case 'error':
      logger.error(`Client Error: ${message}`, clientLogData);
      break;
    case 'warn':
      logger.warn(`Client Warning: ${message}`, clientLogData);
      break;
    case 'info':
      logger.info(`Client Info: ${message}`, clientLogData);
      break;
    case 'debug':
      logger.debug(`Client Debug: ${message}`, clientLogData);
      break;
    default:
      logger.info(`Client Log: ${message}`, clientLogData);
  }

  res.status(200).json({
    success: true,
    message: 'Log received'
  });
}));

// GET /api/logs/health - Log endpoint health check
router.get('/health', (req, res) => {
  logger.info('Log endpoint health check', { requestor: req.ip });
  res.status(200).json({
    success: true,
    message: 'Logging service is operational',
    timestamp: new Date().toISOString()
  });
});

export default router;