import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './services/logger.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import emotionRoutes from './routes/emotions.js';
import progressRoutes from './routes/progress.js';
import adminRoutes from './routes/admin.js';
import logsRoutes from './routes/logs.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger, responseTimeMiddleware } from './middleware/requestLogger.js';

// Import database connection
import { connectDB } from './config/database.js';

dotenv.config();
logger.info('Configuration loaded', { frontendUrl: process.env.FRONTEND_URL });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect to database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(responseTimeMiddleware);
app.use(requestLogger);
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'MoodMirror Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/emotions', authenticateToken, emotionRoutes);
app.use('/api/progress', authenticateToken, progressRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/logs', logsRoutes); // Logs route doesn't require auth for client logs

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.logSocketEvent('user_connected', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(userId);
    logger.logSocketEvent('user_joined_room', socket.id, userId);
  });

  socket.on('emotion-analysis', (data) => {
    // Handle real-time emotion analysis
    socket.emit('analysis-result', {
      emotion: data.emotion,
      confidence: data.confidence,
      timestamp: new Date()
    });
    logger.logEmotionAnalysis(data.userId, 'realtime', data.emotion, data.confidence);
  });

  socket.on('disconnect', () => {
    logger.logSocketEvent('user_disconnected', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.success('MoodMirror Backend started successfully', {
    port: PORT,
    healthCheck: `http://localhost:${PORT}/health`,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    environment: process.env.NODE_ENV || 'development'
  });
});

export { io };