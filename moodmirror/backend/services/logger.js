import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logDir = 'logs';
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta
    };
    
    return JSON.stringify(logEntry, null, 2);
  }

  writeToFile(filename, content) {
    const filepath = path.join(this.logDir, filename);
    const logLine = content + '\n';
    
    fs.appendFile(filepath, logLine, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage('info', message, meta);
    console.log(`ℹ️  ${formatted}`);
    this.writeToFile('app.log', formatted);
  }

  error(message, meta = {}) {
    const formatted = this.formatMessage('error', message, meta);
    console.error(`❌ ${formatted}`);
    this.writeToFile('error.log', formatted);
    this.writeToFile('app.log', formatted);
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage('warn', message, meta);
    console.warn(`⚠️  ${formatted}`);
    this.writeToFile('app.log', formatted);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message, meta);
      console.log(`🐛 ${formatted}`);
      this.writeToFile('debug.log', formatted);
    }
  }

  success(message, meta = {}) {
    const formatted = this.formatMessage('success', message, meta);
    console.log(`✅ ${formatted}`);
    this.writeToFile('app.log', formatted);
  }

  // Specialized logging methods
  logRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    };
    
    this.info('HTTP Request', logData);
  }

  logError(error, req = null) {
    const errorData = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(req && {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous'
      })
    };

    this.error('Application Error', errorData);
  }

  logDatabaseOperation(operation, collection, result, duration) {
    this.debug('Database Operation', {
      operation,
      collection,
      success: !!result,
      duration: `${duration}ms`,
      resultCount: Array.isArray(result) ? result.length : result ? 1 : 0
    });
  }

  logAuthEvent(event, userId, details = {}) {
    this.info('Authentication Event', {
      event,
      userId,
      ...details
    });
  }

  logEmotionAnalysis(userId, analysisType, result, confidence) {
    this.info('Emotion Analysis', {
      userId,
      analysisType,
      emotion: result,
      confidence,
      timestamp: new Date().toISOString()
    });
  }

  logSocketEvent(event, socketId, userId = null, data = {}) {
    this.debug('Socket Event', {
      event,
      socketId,
      userId,
      ...data
    });
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;