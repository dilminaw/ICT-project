import morgan from 'morgan';
import logger from '../services/logger.js';

// Custom Morgan token for response time
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime || '0';
});

// Custom Morgan format
const morganFormat = ':method :url :status :response-time-ms ms - :res[content-length] bytes';

// Custom Morgan stream that writes to our logger
const morganStream = {
  write: (message) => {
    // Parse the Morgan message to extract details
    const parts = message.trim().split(' ');
    const method = parts[0];
    const url = parts[1];
    const status = parseInt(parts[2]);
    const responseTime = parts[3];
    
    const logData = {
      method,
      url,
      statusCode: status,
      responseTime: `${responseTime}ms`,
      contentLength: parts[6] !== '-' ? parts[6] : '0'
    };

    // Log with appropriate level based on status code
    if (status >= 500) {
      logger.error('HTTP Request Error', logData);
    } else if (status >= 400) {
      logger.warn('HTTP Request Warning', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  }
};

// Create the Morgan middleware
export const requestLogger = morgan(morganFormat, { 
  stream: morganStream,
  skip: (req, res) => {
    // Skip logging for health check endpoint in production
    return process.env.NODE_ENV === 'production' && req.url === '/health';
  }
});

// Response time middleware
export const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    res.setHeader('X-Response-Time', responseTime);
    
    // Log detailed request info for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Request completed', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous'
      });
    }
  });
  
  next();
};