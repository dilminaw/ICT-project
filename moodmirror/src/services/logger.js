// Frontend Logger Service
class FrontendLogger {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.enabled = import.meta.env.MODE !== 'test';
  }

  formatMessage(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...meta
    };
  }

  async sendToBackend(logData) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${this.apiUrl}/api/logs/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(logData)
      });
    } catch (error) {
      // Silently fail if backend logging fails
      console.warn('Failed to send log to backend:', error);
    }
  }

  info(message, meta = {}) {
    if (!this.enabled) return;
    
    const logData = this.formatMessage('info', message, meta);
    console.log('ℹ️', logData);
    this.sendToBackend(logData);
  }

  warn(message, meta = {}) {
    if (!this.enabled) return;
    
    const logData = this.formatMessage('warn', message, meta);
    console.warn('⚠️', logData);
    this.sendToBackend(logData);
  }

  error(message, error = null, meta = {}) {
    if (!this.enabled) return;
    
    const errorData = {
      ...meta,
      ...(error && {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack
      })
    };
    
    const logData = this.formatMessage('error', message, errorData);
    console.error('❌', logData);
    this.sendToBackend(logData);
  }

  debug(message, meta = {}) {
    if (!this.enabled || import.meta.env.MODE === 'production') return;
    
    const logData = this.formatMessage('debug', message, meta);
    console.log('🐛', logData);
  }

  // Specialized logging methods
  logUserAction(action, details = {}) {
    this.info('User Action', { action, ...details });
  }

  logPageView(page) {
    this.info('Page View', { page, referrer: document.referrer });
  }

  logApiCall(method, url, status, responseTime) {
    const level = status >= 400 ? 'warn' : 'info';
    this[level]('API Call', {
      method,
      url,
      status,
      responseTime: `${responseTime}ms`
    });
  }

  logEmotionScan(type, result) {
    this.info('Emotion Scan', {
      scanType: type,
      emotion: result.emotion,
      confidence: result.confidence
    });
  }
}

// Create singleton instance
const logger = new FrontendLogger();

// Global error handler
window.addEventListener('error', (event) => {
  logger.error('Uncaught Error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', event.reason);
});

export default logger;