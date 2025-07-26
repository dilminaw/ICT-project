import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Brain, Target, Award, BarChart3, LineChart, PieChart } from 'lucide-react';
import apiService from '../services/api.js';

export default function ProgressPage() {
  const [progressData, setProgressData] = useState(null);
  const [emotionTrends, setEmotionTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    fetchProgressData();
  }, [selectedPeriod]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [overview, trends] = await Promise.all([
        apiService.getProgressOverview(),
        apiService.getProgressTrends()
      ]);
      setProgressData(overview);
      setEmotionTrends(trends);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockData = {
    overview: {
      totalScans: 45,
      averageMood: 7.2,
      improvementRate: 15,
      streakDays: 12,
      recentEmotions: ['Happy', 'Calm', 'Focused', 'Optimistic', 'Relaxed']
    },
    weeklyTrends: [
      { day: 'Mon', mood: 6.5, stress: 4.2 },
      { day: 'Tue', mood: 7.1, stress: 3.8 },
      { day: 'Wed', mood: 6.8, stress: 5.1 },
      { day: 'Thu', mood: 8.2, stress: 2.9 },
      { day: 'Fri', mood: 7.9, stress: 3.5 },
      { day: 'Sat', mood: 8.5, stress: 2.1 },
      { day: 'Sun', mood: 7.7, stress: 2.8 }
    ],
    emotionDistribution: [
      { emotion: 'Happy', percentage: 35, color: 'bg-green-500' },
      { emotion: 'Calm', percentage: 25, color: 'bg-blue-500' },
      { emotion: 'Neutral', percentage: 20, color: 'bg-gray-500' },
      { emotion: 'Stressed', percentage: 15, color: 'bg-orange-500' },
      { emotion: 'Sad', percentage: 5, color: 'bg-red-500' }
    ]
  };

  const data = progressData || mockData;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your mental health journey and celebrate your improvements</p>
        </div>

        {/* Period Selection */}
        <div className="mb-8">
          <div className="flex gap-2">
            {['7days', '1month', '3months', '1year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-50'
                }`}
              >
                {period === '7days' ? 'Last 7 Days' :
                 period === '1month' ? 'Last Month' :
                 period === '3months' ? 'Last 3 Months' : 'Last Year'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview?.totalScans || 45}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Total Scans</h3>
            <p className="text-sm text-gray-600">Emotion assessments completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview?.averageMood || 7.2}/10</span>
            </div>
            <h3 className="font-semibold text-gray-900">Average Mood</h3>
            <p className="text-sm text-gray-600">This week's mood rating</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">+{data.overview?.improvementRate || 15}%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Improvement</h3>
            <p className="text-sm text-gray-600">From last period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{data.overview?.streakDays || 12}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Day Streak</h3>
            <p className="text-sm text-gray-600">Consecutive tracking days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Mood Trends */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <LineChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Weekly Mood Trends</h2>
            </div>
            <div className="space-y-4">
              {mockData.weeklyTrends.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 w-12">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-200 rounded-full h-2 flex-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.mood / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{day.mood}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotion Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Emotion Distribution</h2>
            </div>
            <div className="space-y-4">
              {mockData.emotionDistribution.map((emotion, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${emotion.color}`} />
                  <span className="font-medium text-gray-700 flex-1">{emotion.emotion}</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 rounded-full h-2 w-20">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${emotion.color}`}
                        style={{ width: `${emotion.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8">{emotion.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {[
              { date: 'Today', time: '2:30 PM', emotion: 'Happy', score: 8.5, note: 'Great presentation today!' },
              { date: 'Today', time: '10:15 AM', emotion: 'Focused', score: 7.8, note: 'Morning study session' },
              { date: 'Yesterday', time: '8:45 PM', emotion: 'Relaxed', score: 8.2, note: 'Finished assignments early' },
              { date: 'Yesterday', time: '3:20 PM', emotion: 'Neutral', score: 6.5, note: 'Regular check-in' },
              { date: '2 days ago', time: '11:30 AM', emotion: 'Stressed', score: 4.2, note: 'Exam preparation' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-600">{activity.date}</span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  activity.emotion === 'Happy' ? 'bg-green-500' :
                  activity.emotion === 'Focused' ? 'bg-blue-500' :
                  activity.emotion === 'Relaxed' ? 'bg-purple-500' :
                  activity.emotion === 'Neutral' ? 'bg-gray-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{activity.emotion}</span>
                    <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                      {activity.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-semibold">AI Insights & Recommendations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">✨ Key Insights</h3>
              <ul className="space-y-2 text-purple-100">
                <li>• Your mood tends to be highest on weekends</li>
                <li>• Morning sessions show more positive emotions</li>
                <li>• 15% improvement in stress management this month</li>
                <li>• Consistent tracking has improved your awareness</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🎯 Recommendations</h3>
              <ul className="space-y-2 text-purple-100">
                <li>• Try meditation during mid-week stress peaks</li>
                <li>• Continue your weekend relaxation routine</li>
                <li>• Practice breathing exercises before exams</li>
                <li>• Maintain your current tracking schedule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}