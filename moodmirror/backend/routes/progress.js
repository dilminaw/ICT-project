import express from 'express';
import EmotionRecord from '../models/EmotionRecord.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/progress/overview
// @desc    Get progress overview with key metrics
// @access  Private
router.get('/overview', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // Get recent records
  const recentRecords = await EmotionRecord.find({
    userId: req.user._id,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });

  // Calculate key metrics
  const totalRecords = recentRecords.length;
  const avgMoodScore = totalRecords > 0 
    ? recentRecords.reduce((sum, record) => sum + record.aiAnalysis.moodScore, 0) / totalRecords 
    : 0;

  // Mood distribution
  const moodDistribution = {};
  recentRecords.forEach(record => {
    const mood = record.aiAnalysis.overallMood;
    moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
  });

  // Emotion distribution
  const emotionDistribution = {};
  recentRecords.forEach(record => {
    const emotion = record.faceAnalysis?.primaryEmotion;
    if (emotion) {
      emotionDistribution[emotion] = (emotionDistribution[emotion] || 0) + 1;
    }
  });

  // Weekly trends
  const weeklyTrends = await EmotionRecord.aggregate([
    {
      $match: {
        userId: req.user._id,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' }
        },
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 }
    }
  ]);

  // Risk assessment
  const highRiskRecords = recentRecords.filter(record => 
    record.aiAnalysis.riskLevel === 'high' || record.aiAnalysis.riskLevel === 'critical'
  );

  res.json({
    success: true,
    data: {
      overview: {
        totalRecords,
        averageMoodScore: Math.round(avgMoodScore * 10) / 10,
        daysTracked: parseInt(days),
        highRiskSessions: highRiskRecords.length
      },
      moodDistribution,
      emotionDistribution,
      weeklyTrends,
      recentActivity: recentRecords.slice(0, 5).map(record => ({
        id: record._id,
        timestamp: record.timestamp,
        moodScore: record.aiAnalysis.moodScore,
        overallMood: record.aiAnalysis.overallMood,
        primaryEmotion: record.faceAnalysis?.primaryEmotion
      }))
    }
  });
}));

// @route   GET /api/progress/trends
// @desc    Get detailed trends and patterns
// @access  Private
router.get('/trends', asyncHandler(async (req, res) => {
  const { period = 'month', granularity = 'day' } = req.query;
  
  let startDate = new Date();
  let groupFormat = '%Y-%m-%d';
  
  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      groupFormat = '%Y-%m-%d';
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      groupFormat = '%Y-%m-%d';
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      groupFormat = '%Y-%m';
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      groupFormat = '%Y-%m';
      break;
  }

  // Get trends data
  const trends = await EmotionRecord.aggregate([
    {
      $match: {
        userId: req.user._id,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: groupFormat, date: '$timestamp' }
        },
        avgMoodScore: { $avg: '$aiAnalysis.moodScore' },
        minMoodScore: { $min: '$aiAnalysis.moodScore' },
        maxMoodScore: { $max: '$aiAnalysis.moodScore' },
        count: { $sum: 1 },
        emotions: { $push: '$faceAnalysis.primaryEmotion' },
        moods: { $push: '$aiAnalysis.overallMood' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  // Calculate patterns
  const patterns = await analyzePatterns(req.user._id, startDate);

  res.json({
    success: true,
    data: {
      trends,
      patterns,
      period,
      granularity
    }
  });
}));

// @route   GET /api/progress/insights
// @desc    Get AI-generated insights about user's progress
// @access  Private
router.get('/insights', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const records = await EmotionRecord.find({
    userId: req.user._id,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });

  if (records.length === 0) {
    return res.json({
      success: true,
      data: {
        insights: ['Start tracking your emotions to get personalized insights!'],
        recommendations: ['Begin your first emotion scan to establish a baseline.']
      }
    });
  }

  const insights = generateInsights(records);
  const recommendations = generateRecommendations(records);

  res.json({
    success: true,
    data: {
      insights,
      recommendations,
      analysisPeriod: `${days} days`
    }
  });
}));

// @route   GET /api/progress/goals
// @desc    Get progress towards mental health goals
// @access  Private
router.get('/goals', asyncHandler(async (req, res) => {
  // This would typically integrate with a goals system
  // For now, return default goals based on user's progress
  
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const recentRecords = await EmotionRecord.find({
    userId: req.user._id,
    timestamp: { $gte: startDate }
  });

  const avgMoodScore = recentRecords.length > 0 
    ? recentRecords.reduce((sum, record) => sum + record.aiAnalysis.moodScore, 0) / recentRecords.length 
    : 50;

  const goals = generateGoals(avgMoodScore, recentRecords.length);

  res.json({
    success: true,
    data: {
      goals,
      currentProgress: {
        averageMoodScore: Math.round(avgMoodScore * 10) / 10,
        sessionsCompleted: recentRecords.length,
        consistencyScore: calculateConsistency(recentRecords)
      }
    }
  });
}));

// Helper function to analyze patterns
async function analyzePatterns(userId, startDate) {
  const records = await EmotionRecord.find({
    userId,
    timestamp: { $gte: startDate }
  });

  const patterns = {
    timeOfDay: {},
    dayOfWeek: {},
    commonEmotions: {},
    moodTriggers: []
  };

  records.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    const day = new Date(record.timestamp).getDay();
    const emotion = record.faceAnalysis?.primaryEmotion;
    const mood = record.aiAnalysis.overallMood;

    // Time of day patterns
    const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    patterns.timeOfDay[timeSlot] = patterns.timeOfDay[timeSlot] || { count: 0, avgMood: 0 };
    patterns.timeOfDay[timeSlot].count++;
    patterns.timeOfDay[timeSlot].avgMood += record.aiAnalysis.moodScore;

    // Day of week patterns
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    patterns.dayOfWeek[dayNames[day]] = patterns.dayOfWeek[dayNames[day]] || { count: 0, avgMood: 0 };
    patterns.dayOfWeek[dayNames[day]].count++;
    patterns.dayOfWeek[dayNames[day]].avgMood += record.aiAnalysis.moodScore;

    // Common emotions
    if (emotion) {
      patterns.commonEmotions[emotion] = (patterns.commonEmotions[emotion] || 0) + 1;
    }
  });

  // Calculate averages
  Object.keys(patterns.timeOfDay).forEach(time => {
    patterns.timeOfDay[time].avgMood /= patterns.timeOfDay[time].count;
  });

  Object.keys(patterns.dayOfWeek).forEach(day => {
    patterns.dayOfWeek[day].avgMood /= patterns.dayOfWeek[day].count;
  });

  return patterns;
}

// Helper function to generate insights
function generateInsights(records) {
  const insights = [];
  
  if (records.length < 3) {
    insights.push('Continue tracking to get more detailed insights.');
    return insights;
  }

  const avgMoodScore = records.reduce((sum, record) => sum + record.aiAnalysis.moodScore, 0) / records.length;
  
  if (avgMoodScore > 70) {
    insights.push('Your mood has been consistently positive!');
  } else if (avgMoodScore < 30) {
    insights.push('Your mood has been consistently low. Consider reaching out for support.');
  } else {
    insights.push('Your mood has been moderate with some fluctuations.');
  }

  // Analyze trends
  const recentScores = records.slice(0, 5).map(r => r.aiAnalysis.moodScore);
  const trend = recentScores[0] - recentScores[recentScores.length - 1];
  
  if (trend > 10) {
    insights.push('Your mood has been improving recently.');
  } else if (trend < -10) {
    insights.push('Your mood has been declining recently.');
  }

  return insights;
}

// Helper function to generate recommendations
function generateRecommendations(records) {
  const recommendations = [];
  
  const avgMoodScore = records.reduce((sum, record) => sum + record.aiAnalysis.moodScore, 0) / records.length;
  
  if (avgMoodScore < 40) {
    recommendations.push('Consider scheduling regular check-ins with a mental health professional.');
    recommendations.push('Try incorporating daily exercise into your routine.');
  }
  
  if (records.length < 7) {
    recommendations.push('Aim to track your emotions daily for better insights.');
  }

  return recommendations;
}

// Helper function to generate goals
function generateGoals(avgMoodScore, sessionCount) {
  const goals = [];
  
  if (avgMoodScore < 50) {
    goals.push({
      id: 'improve_mood',
      title: 'Improve Average Mood',
      description: 'Work towards increasing your average mood score',
      target: Math.min(avgMoodScore + 15, 70),
      current: avgMoodScore,
      type: 'mood_score'
    });
  }
  
  if (sessionCount < 10) {
    goals.push({
      id: 'increase_tracking',
      title: 'Increase Tracking Frequency',
      description: 'Track your emotions more regularly',
      target: 10,
      current: sessionCount,
      type: 'session_count'
    });
  }

  return goals;
}

// Helper function to calculate consistency
function calculateConsistency(records) {
  if (records.length < 2) return 0;
  
  const dates = records.map(r => r.timestamp.toDateString());
  const uniqueDates = [...new Set(dates)];
  
  return Math.round((uniqueDates.length / records.length) * 100);
}

export default router; 