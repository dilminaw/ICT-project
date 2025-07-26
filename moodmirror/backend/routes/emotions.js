import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import EmotionRecord from '../models/EmotionRecord.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { analyzeEmotion } from '../services/emotionAnalysis.js';
import logger from '../services/logger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wav|mp3|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, video, and audio files are allowed'));
    }
  }
});

// Validation middleware
const validateEmotionAnalysis = [
  body('sessionId').notEmpty().withMessage('Session ID is required'),
  body('deviceInfo.type').isIn(['webcam', 'mobile', 'desktop']).withMessage('Invalid device type'),
  body('userInput.moodRating').optional().isInt({ min: 1, max: 10 }).withMessage('Mood rating must be between 1 and 10'),
  body('userInput.notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),
  body('userInput.tags').optional().isArray().withMessage('Tags must be an array'),
  body('userInput.activities').optional().isArray().withMessage('Activities must be an array')
];

// @route   POST /api/emotions/analyze
// @desc    Analyze emotion from uploaded files and user input
// @access  Private
router.post('/analyze', upload.fields([
  { name: 'faceImage', maxCount: 1 },
  { name: 'voiceAudio', maxCount: 1 },
  { name: 'bodyVideo', maxCount: 1 }
]), validateEmotionAnalysis, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const startTime = Date.now();
  const { sessionId, deviceInfo, userInput } = req.body;
  const files = req.files;

  try {
    // Initialize analysis results
    let faceAnalysis = null;
    let voiceAnalysis = null;
    let bodyAnalysis = null;

    // Analyze face if image is provided
    if (files.faceImage) {
      const faceResult = await analyzeEmotion('face', files.faceImage[0].path);
      faceAnalysis = {
        primaryEmotion: faceResult.primaryEmotion,
        confidence: faceResult.confidence,
        secondaryEmotions: faceResult.secondaryEmotions || [],
        facialFeatures: faceResult.facialFeatures || {}
      };
    }

    // Analyze voice if audio is provided
    if (files.voiceAudio) {
      const voiceResult = await analyzeEmotion('voice', files.voiceAudio[0].path);
      voiceAnalysis = {
        primaryEmotion: voiceResult.primaryEmotion,
        confidence: voiceResult.confidence,
        audioFeatures: voiceResult.audioFeatures || {}
      };
    }

    // Analyze body language if video is provided
    if (files.bodyVideo) {
      const bodyResult = await analyzeEmotion('body', files.bodyVideo[0].path);
      bodyAnalysis = {
        posture: bodyResult.posture,
        gestures: bodyResult.gestures || [],
        movement: bodyResult.movement
      };
    }

    // Combine all analyses for overall assessment
    const overallAnalysis = await analyzeEmotion('combined', {
      face: faceAnalysis,
      voice: voiceAnalysis,
      body: bodyAnalysis,
      userInput
    });

    // Create emotion record
    const emotionRecord = new EmotionRecord({
      userId: req.user._id,
      sessionId,
      deviceInfo: {
        type: deviceInfo.type,
        browser: req.headers['user-agent'],
        os: deviceInfo.os || 'unknown',
        screenResolution: deviceInfo.screenResolution || 'unknown'
      },
      faceAnalysis,
      voiceAnalysis,
      bodyAnalysis,
      userInput: {
        moodRating: userInput.moodRating,
        notes: userInput.notes,
        tags: userInput.tags || [],
        activities: userInput.activities || []
      },
      aiAnalysis: {
        overallMood: overallAnalysis.overallMood,
        moodScore: overallAnalysis.moodScore,
        riskLevel: overallAnalysis.riskLevel,
        recommendations: overallAnalysis.recommendations || [],
        insights: overallAnalysis.insights
      },
      processingTime: Date.now() - startTime
    });

    await emotionRecord.save();

    res.status(201).json({
      success: true,
      message: 'Emotion analysis completed successfully',
      data: {
        record: emotionRecord.getSummary(),
        analysis: {
          face: faceAnalysis,
          voice: voiceAnalysis,
          body: bodyAnalysis,
          overall: overallAnalysis
        },
        processingTime: emotionRecord.processingTime
      }
    });

  } catch (error) {
    logger.error('Emotion analysis route error', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id 
    });
    res.status(500).json({
      success: false,
      error: 'Failed to analyze emotion',
      message: 'Please try again later'
    });
  }
}));

// @route   GET /api/emotions/history
// @desc    Get user's emotion analysis history
// @access  Private
router.get('/history', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  let query = { userId: req.user._id };

  // Add date filter if provided
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const records = await EmotionRecord.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('timestamp aiAnalysis.overallMood aiAnalysis.moodScore faceAnalysis.primaryEmotion userInput.notes');

  const total = await EmotionRecord.countDocuments(query);

  res.json({
    success: true,
    data: {
      records,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: skip + records.length < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @route   GET /api/emotions/trends
// @desc    Get user's mood trends and statistics
// @access  Private
router.get('/trends', asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;

  const trends = await EmotionRecord.getMoodTrends(req.user._id, parseInt(days));

  // Calculate overall statistics
  const stats = await EmotionRecord.aggregate([
    {
      $match: {
        userId: req.user._id,
        timestamp: { $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: null,
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' },
        totalRecords: { $sum: 1 },
        moodDistribution: {
          $push: '$aiAnalysis.overallMood'
        },
        emotionDistribution: {
          $push: '$faceAnalysis.primaryEmotion'
        }
      }
    }
  ]);

  // Calculate mood distribution
  const moodCounts = {};
  const emotionCounts = {};
  
  if (stats.length > 0) {
    stats[0].moodDistribution.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    stats[0].emotionDistribution.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  }

  res.json({
    success: true,
    data: {
      trends,
      statistics: {
        averageMoodScore: stats[0]?.avgMoodScore || 0,
        totalRecords: stats[0]?.totalRecords || 0,
        moodDistribution: moodCounts,
        emotionDistribution: emotionCounts
      }
    }
  });
}));

// @route   GET /api/emotions/:id
// @desc    Get specific emotion record
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const record = await EmotionRecord.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Record not found'
    });
  }

  res.json({
    success: true,
    data: {
      record
    }
  });
}));

// @route   DELETE /api/emotions/:id
// @desc    Delete specific emotion record
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const record = await EmotionRecord.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Record not found'
    });
  }

  res.json({
    success: true,
    message: 'Record deleted successfully'
  });
}));

export default router; 