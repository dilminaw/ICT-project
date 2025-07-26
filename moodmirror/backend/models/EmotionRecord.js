import mongoose from 'mongoose';

const emotionRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Face analysis results
  faceAnalysis: {
    primaryEmotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    secondaryEmotions: [{
      emotion: {
        type: String,
        enum: ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral']
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1
      }
    }],
    facialFeatures: {
      smileIntensity: { type: Number, min: 0, max: 1 },
      eyeOpenness: { type: Number, min: 0, max: 1 },
      eyebrowPosition: { type: Number, min: -1, max: 1 },
      mouthOpenness: { type: Number, min: 0, max: 1 }
    }
  },
  // Voice analysis results
  voiceAnalysis: {
    primaryEmotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'fearful', 'surprised', 'disgusted', 'neutral'],
      required: false
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: false
    },
    audioFeatures: {
      pitch: { type: Number },
      volume: { type: Number },
      speakingRate: { type: Number },
      voiceQuality: { type: String, enum: ['clear', 'hoarse', 'trembling', 'monotone'] }
    }
  },
  // Body language analysis
  bodyAnalysis: {
    posture: {
      type: String,
      enum: ['upright', 'slouched', 'tense', 'relaxed', 'defensive'],
      required: false
    },
    gestures: [{
      type: String,
      enum: ['arms_crossed', 'hands_clasped', 'pointing', 'touching_face', 'fidgeting']
    }],
    movement: {
      type: String,
      enum: ['still', 'fidgeting', 'pacing', 'rocking'],
      required: false
    }
  },
  // User input
  userInput: {
    moodRating: {
      type: Number,
      min: 1,
      max: 10,
      required: false
    },
    notes: {
      type: String,
      maxlength: 1000,
      required: false
    },
    tags: [{
      type: String,
      maxlength: 50
    }],
    activities: [{
      type: String,
      enum: ['work', 'study', 'exercise', 'social', 'rest', 'hobby', 'other']
    }]
  },
  // AI analysis and recommendations
  aiAnalysis: {
    overallMood: {
      type: String,
      enum: ['excellent', 'good', 'neutral', 'poor', 'critical'],
      required: true
    },
    moodScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    recommendations: [{
      type: String,
      enum: [
        'take_break',
        'exercise',
        'meditation',
        'social_contact',
        'professional_help',
        'positive_activities',
        'sleep_improvement',
        'nutrition'
      ]
    }],
    insights: {
      type: String,
      maxlength: 500
    }
  },
  // Metadata
  sessionId: {
    type: String,
    required: true
  },
  deviceInfo: {
    type: {
      type: String,
      enum: ['webcam', 'mobile', 'desktop'],
      required: true
    },
    browser: String,
    os: String,
    screenResolution: String
  },
  processingTime: {
    type: Number, // in milliseconds
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
emotionRecordSchema.index({ userId: 1, timestamp: -1 });
emotionRecordSchema.index({ 'aiAnalysis.overallMood': 1 });
emotionRecordSchema.index({ 'aiAnalysis.riskLevel': 1 });
emotionRecordSchema.index({ sessionId: 1 });

// Virtual for date (for easier querying)
emotionRecordSchema.virtual('date').get(function() {
  return this.timestamp.toISOString().split('T')[0];
});

// Method to get summary statistics
emotionRecordSchema.methods.getSummary = function() {
  return {
    id: this._id,
    timestamp: this.timestamp,
    overallMood: this.aiAnalysis.overallMood,
    moodScore: this.aiAnalysis.moodScore,
    riskLevel: this.aiAnalysis.riskLevel,
    primaryEmotion: this.faceAnalysis.primaryEmotion,
    confidence: this.faceAnalysis.confidence
  };
};

// Static method to get user's mood trends
emotionRecordSchema.statics.getMoodTrends = async function(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        avgMoodScore: { $avg: "$aiAnalysis.moodScore" },
        count: { $sum: 1 },
        emotions: { $push: "$faceAnalysis.primaryEmotion" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Ensure virtual fields are serialized
emotionRecordSchema.set('toJSON', { virtuals: true });
emotionRecordSchema.set('toObject', { virtuals: true });

export default mongoose.model('EmotionRecord', emotionRecordSchema); 