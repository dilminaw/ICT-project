import express from 'express';
import User from '../models/User.js';
import EmotionRecord from '../models/EmotionRecord.js';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Get overall statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalRecords = await EmotionRecord.countDocuments();
  
  // Get recent activity
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username email firstName lastName createdAt isActive');

  const recentRecords = await EmotionRecord.find()
    .sort({ timestamp: -1 })
    .limit(10)
    .populate('userId', 'username firstName lastName')
    .select('timestamp aiAnalysis.overallMood aiAnalysis.moodScore aiAnalysis.riskLevel');

  // Get mood distribution
  const moodDistribution = await EmotionRecord.aggregate([
    {
      $group: {
        _id: '$aiAnalysis.overallMood',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get risk level distribution
  const riskDistribution = await EmotionRecord.aggregate([
    {
      $group: {
        _id: '$aiAnalysis.riskLevel',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get daily activity for the last 7 days
  const dailyActivity = await EmotionRecord.aggregate([
    {
      $match: {
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        activeUsers,
        totalRecords,
        inactiveUsers: totalUsers - activeUsers
      },
      recentActivity: {
        newUsers: recentUsers,
        recentRecords
      },
      analytics: {
        moodDistribution,
        riskDistribution,
        dailyActivity
      }
    }
  });
}));

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Admin
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, status } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  // Apply filters
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } }
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.isActive = status === 'active';
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    }
  });
}));

// @route   GET /api/admin/users/:id
// @desc    Get specific user details
// @access  Admin
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Get user's emotion records
  const records = await EmotionRecord.find({ userId: user._id })
    .sort({ timestamp: -1 })
    .limit(10);

  // Get user statistics
  const stats = await EmotionRecord.aggregate([
    {
      $match: { userId: user._id }
    },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' },
        highRiskSessions: {
          $sum: {
            $cond: [
              { $in: ['$aiAnalysis.riskLevel', ['high', 'critical']] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      user,
      records,
      statistics: stats[0] || {
        totalRecords: 0,
        avgMoodScore: 0,
        highRiskSessions: 0
      }
    }
  });
}));

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin)
// @access  Admin
router.put('/users/:id', asyncHandler(async (req, res) => {
  const { role, isActive, firstName, lastName, email } = req.body;

  const updateData = {};
  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (email) updateData.email = email;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user
    }
  });
}));

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin)
// @access  Admin
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete your own account'
    });
  }

  // Deactivate user instead of deleting
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Admin
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let startDate = new Date();
  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  // User growth
  const userGrowth = await User.aggregate([
    {
      $match: { createdAt: { $gte: startDate } }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        newUsers: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  // Emotion analysis trends
  const emotionTrends = await EmotionRecord.aggregate([
    {
      $match: { timestamp: { $gte: startDate } }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        totalRecords: { $sum: 1 },
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' },
        highRiskCount: {
          $sum: {
            $cond: [
              { $in: ['$aiAnalysis.riskLevel', ['high', 'critical']] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  // Top emotions
  const topEmotions = await EmotionRecord.aggregate([
    {
      $match: { timestamp: { $gte: startDate } }
    },
    {
      $group: {
        _id: '$faceAnalysis.primaryEmotion',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    }
  ]);

  // Risk level distribution
  const riskLevels = await EmotionRecord.aggregate([
    {
      $match: { timestamp: { $gte: startDate } }
    },
    {
      $group: {
        _id: '$aiAnalysis.riskLevel',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      period,
      userGrowth,
      emotionTrends,
      topEmotions,
      riskLevels
    }
  });
}));

// @route   GET /api/admin/records
// @desc    Get all emotion records with filters
// @access  Admin
router.get('/records', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, userId, riskLevel, startDate, endDate } = req.query;
  const skip = (page - 1) * limit;

  let query = {};

  if (userId) query.userId = userId;
  if (riskLevel) query['aiAnalysis.riskLevel'] = riskLevel;
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const records = await EmotionRecord.find(query)
    .populate('userId', 'username firstName lastName email')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit));

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

export default router; 