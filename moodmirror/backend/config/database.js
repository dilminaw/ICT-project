import mongoose from 'mongoose';
import logger from '../services/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moodmirror', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.success('Database connected successfully', { 
      host: conn.connection.host,
      database: conn.connection.name
    });
  } catch (error) {
    logger.error('Database connection failed', { 
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('Database disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('Database connection error', { error: err.message });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Database connection closed gracefully');
  process.exit(0);
});