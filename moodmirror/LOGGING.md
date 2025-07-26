# MoodMirror Logging System

A comprehensive logging system for both frontend and backend error tracking, debugging, and monitoring.

## Features

- ✅ Structured JSON logging
- ✅ Multiple log levels (info, warn, error, debug)
- ✅ File-based logging on backend
- ✅ Client-side error tracking
- ✅ HTTP request logging
- ✅ Database operation logging
- ✅ Authentication event logging
- ✅ Emotion analysis logging
- ✅ Socket.IO event logging

## Backend Logger

### Basic Usage

```javascript
import logger from './services/logger.js';

// Basic logging
logger.info('User logged in', { userId: 123 });
logger.warn('High memory usage detected', { usage: '85%' });
logger.error('Database connection failed', { error: err.message });
logger.debug('Cache hit', { key: 'user:123' });
logger.success('Server started successfully', { port: 5000 });
```

### Specialized Methods

```javascript
// HTTP Request logging (automatic via middleware)
logger.logRequest(req, res, responseTime);

// Error logging with context
logger.logError(error, req);

// Database operations
logger.logDatabaseOperation('find', 'users', result, duration);

// Authentication events
logger.logAuthEvent('login_success', userId, { ip: req.ip });

// Emotion analysis
logger.logEmotionAnalysis(userId, 'face', 'happy', 0.95);

// Socket events
logger.logSocketEvent('user_connected', socketId, userId);
```

### Log Files

Logs are written to the `backend/logs/` directory:

- `app.log` - All application logs
- `error.log` - Error logs only
- `debug.log` - Debug logs (development only)

### Log Format

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "User logged in",
  "userId": 123,
  "ip": "192.168.1.1"
}
```

## Frontend Logger

### Basic Usage

```javascript
import logger from '../services/logger.js';

// Basic logging
logger.info('Page loaded', { page: 'dashboard' });
logger.warn('API response slow', { responseTime: 5000 });
logger.error('Failed to save data', error, { formData: data });
logger.debug('State updated', { newState: state });
```

### Specialized Methods

```javascript
// User actions
logger.logUserAction('button_click', { button: 'submit' });

// Page views
logger.logPageView('emotion-scan');

// API calls
logger.logApiCall('POST', '/api/emotions', 200, 150);

// Emotion scans
logger.logEmotionScan('face', { emotion: 'happy', confidence: 0.9 });
```

### Global Error Handling

The frontend logger automatically captures:

- Uncaught JavaScript errors
- Unhandled promise rejections
- All logs are sent to the backend for centralized storage

## Configuration

### Environment Variables

```bash
# Backend
NODE_ENV=development|production  # Controls debug logging
LOG_LEVEL=debug|info|warn|error  # Minimum log level

# Frontend
VITE_API_URL=http://localhost:5000  # Backend URL for log forwarding
```

### Middleware Setup

The logging middleware is automatically configured in `server.js`:

```javascript
app.use(responseTimeMiddleware);
app.use(requestLogger);
```

## Best Practices

### 1. Use Appropriate Log Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General application flow
- **WARN**: Potentially harmful situations
- **ERROR**: Error events that don't stop the application
- **SUCCESS**: Successful operations (custom level)

### 2. Include Context

Always include relevant context in your logs:

```javascript
// Good
logger.error('Payment processing failed', error, {
  userId: user.id,
  amount: payment.amount,
  paymentMethod: payment.method
});

// Bad
logger.error('Payment failed');
```

### 3. Avoid Sensitive Data

Never log sensitive information:

```javascript
// Never do this
logger.info('User login', { password: user.password });

// Do this instead
logger.info('User login', { userId: user.id, email: user.email });
```

### 4. Use Structured Data

Prefer structured data over string concatenation:

```javascript
// Good
logger.info('User action completed', {
  action: 'create_post',
  userId: user.id,
  duration: Date.now() - startTime
});

// Bad
logger.info(`User ${user.id} completed action create_post in ${duration}ms`);
```

## Log Analysis

### Viewing Logs

```bash
# View all logs
tail -f backend/logs/app.log

# View only errors
tail -f backend/logs/error.log

# Filter by user
grep "userId.*123" backend/logs/app.log

# Filter by time range
grep "2024-01-15T10:" backend/logs/app.log
```

### Log Rotation

For production, consider implementing log rotation to prevent disk space issues:

```bash
# Install logrotate (Ubuntu/Debian)
sudo apt-get install logrotate

# Configure in /etc/logrotate.d/moodmirror
/path/to/moodmirror/backend/logs/*.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
    create 0644 www-data www-data
}
```

## Troubleshooting

### Common Issues

1. **Logs not appearing**: Check file permissions in the `logs/` directory
2. **Frontend logs not reaching backend**: Verify API URL configuration
3. **Performance impact**: Use appropriate log levels in production

### Performance Considerations

- Debug logs are disabled in production
- File I/O is asynchronous to avoid blocking
- Frontend logs are batched and sent periodically (future enhancement)

## Examples

### Tracking User Journey

```javascript
// Login page
logger.logUserAction('login_attempt', { email });
logger.logUserAction('login_success', { userId });

// Emotion scan page
logger.logPageView('emotion-scan');
logger.logEmotionScan('face', result);

// Error handling
try {
  await saveEmotionData(data);
} catch (error) {
  logger.error('Failed to save emotion data', error, {
    userId,
    emotionType: data.type
  });
}
```

### API Error Tracking

```javascript
// In your API service
const makeRequest = async (method, url, data) => {
  const start = Date.now();
  try {
    const response = await fetch(url, { method, body: data });
    const duration = Date.now() - start;
    
    logger.logApiCall(method, url, response.status, duration);
    return response;
  } catch (error) {
    logger.error('API request failed', error, { method, url });
    throw error;
  }
};
```

This logging system provides comprehensive monitoring and debugging capabilities for the MoodMirror application, helping you track user behavior, identify issues, and maintain application health.