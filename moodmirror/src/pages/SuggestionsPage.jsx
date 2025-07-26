import { useState, useEffect } from 'react';
import { Heart, BookOpen, Music, Coffee, Sun, Moon, Brain, Target, Play, Clock, Star } from 'lucide-react';

export default function SuggestionsPage() {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const moodOptions = [
    { value: 'happy', label: 'Happy', color: 'bg-green-500', icon: '😊' },
    { value: 'sad', label: 'Sad', color: 'bg-blue-500', icon: '😢' },
    { value: 'stressed', label: 'Stressed', color: 'bg-red-500', icon: '😰' },
    { value: 'anxious', label: 'Anxious', color: 'bg-orange-500', icon: '😟' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-500', icon: '😐' },
    { value: 'energetic', label: 'Energetic', color: 'bg-yellow-500', icon: '⚡' }
  ];

  const categories = [
    { value: 'all', label: 'All Suggestions', icon: Target },
    { value: 'breathing', label: 'Breathing & Meditation', icon: Brain },
    { value: 'physical', label: 'Physical Activities', icon: Heart },
    { value: 'creative', label: 'Creative & Arts', icon: Music },
    { value: 'learning', label: 'Learning & Growth', icon: BookOpen },
    { value: 'social', label: 'Social & Connection', icon: Coffee }
  ];

  const getSuggestions = (mood, category) => {
    const allSuggestions = {
      happy: [
        {
          id: 1,
          title: "Share Your Joy",
          description: "Call a friend or family member to share your positive mood",
          category: "social",
          duration: "10-15 mins",
          difficulty: "Easy",
          icon: Coffee,
          benefits: ["Strengthens relationships", "Amplifies positive emotions"]
        },
        {
          id: 2,
          title: "Creative Expression",
          description: "Try painting, drawing, or writing about your current feelings",
          category: "creative",
          duration: "30-60 mins",
          difficulty: "Easy",
          icon: Music,
          benefits: ["Self-expression", "Emotional processing"]
        },
        {
          id: 3,
          title: "Gratitude Journaling",
          description: "Write down 5 things you're grateful for today",
          category: "learning",
          duration: "10 mins",
          difficulty: "Easy",
          icon: BookOpen,
          benefits: ["Increases happiness", "Builds positive mindset"]
        }
      ],
      sad: [
        {
          id: 4,
          title: "Gentle Breathing Exercise",
          description: "4-7-8 breathing technique to calm your mind",
          category: "breathing",
          duration: "5-10 mins",
          difficulty: "Easy",
          icon: Brain,
          benefits: ["Reduces sadness", "Calms nervous system"]
        },
        {
          id: 5,
          title: "Light Physical Activity",
          description: "Take a gentle walk outdoors or do some light stretching",
          category: "physical",
          duration: "15-30 mins",
          difficulty: "Easy",
          icon: Heart,
          benefits: ["Releases endorphins", "Improves mood"]
        },
        {
          id: 6,
          title: "Self-Compassion Practice",
          description: "Practice loving-kindness meditation for yourself",
          category: "breathing",
          duration: "15 mins",
          difficulty: "Medium",
          icon: Brain,
          benefits: ["Builds self-love", "Reduces self-criticism"]
        }
      ],
      stressed: [
        {
          id: 7,
          title: "Progressive Muscle Relaxation",
          description: "Systematically tense and relax different muscle groups",
          category: "breathing",
          duration: "15-20 mins",
          difficulty: "Easy",
          icon: Brain,
          benefits: ["Reduces physical tension", "Calms mind"]
        },
        {
          id: 8,
          title: "Priority Planning",
          description: "Break down overwhelming tasks into manageable steps",
          category: "learning",
          duration: "20 mins",
          difficulty: "Medium",
          icon: BookOpen,
          benefits: ["Reduces overwhelm", "Increases control"]
        },
        {
          id: 9,
          title: "Nature Connection",
          description: "Spend time outdoors, even if just sitting by a window",
          category: "physical",
          duration: "15-30 mins",
          difficulty: "Easy",
          icon: Heart,
          benefits: ["Reduces cortisol", "Grounds emotions"]
        }
      ],
      anxious: [
        {
          id: 10,
          title: "Grounding Technique (5-4-3-2-1)",
          description: "Focus on 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste",
          category: "breathing",
          duration: "5 mins",
          difficulty: "Easy",
          icon: Brain,
          benefits: ["Reduces anxiety", "Brings to present moment"]
        },
        {
          id: 11,
          title: "Calming Music & Tea",
          description: "Listen to soothing music while sipping herbal tea",
          category: "creative",
          duration: "20 mins",
          difficulty: "Easy",
          icon: Music,
          benefits: ["Soothes nervous system", "Creates comfort"]
        },
        {
          id: 12,
          title: "Gentle Yoga Flow",
          description: "Simple yoga poses focused on relaxation and breath",
          category: "physical",
          duration: "20-30 mins",
          difficulty: "Easy",
          icon: Heart,
          benefits: ["Calms anxiety", "Improves body awareness"]
        }
      ],
      neutral: [
        {
          id: 13,
          title: "Mindfulness Check-in",
          description: "Spend a few minutes observing your thoughts and feelings",
          category: "breathing",
          duration: "10 mins",
          difficulty: "Easy",
          icon: Brain,
          benefits: ["Increases self-awareness", "Builds mindfulness"]
        },
        {
          id: 14,
          title: "Learn Something New",
          description: "Watch an educational video or read about a topic you're curious about",
          category: "learning",
          duration: "20-40 mins",
          difficulty: "Medium",
          icon: BookOpen,
          benefits: ["Stimulates mind", "Builds knowledge"]
        },
        {
          id: 15,
          title: "Connect with a Friend",
          description: "Reach out to someone you haven't talked to in a while",
          category: "social",
          duration: "15-30 mins",
          difficulty: "Easy",
          icon: Coffee,
          benefits: ["Strengthens relationships", "May boost mood"]
        }
      ],
      energetic: [
        {
          id: 16,
          title: "High-Energy Workout",
          description: "Do an intense workout or dance session",
          category: "physical",
          duration: "30-45 mins",
          difficulty: "Hard",
          icon: Heart,
          benefits: ["Channels energy", "Improves fitness"]
        },
        {
          id: 17,
          title: "Creative Project",
          description: "Start a new creative project or work on an existing one",
          category: "creative",
          duration: "60+ mins",
          difficulty: "Medium",
          icon: Music,
          benefits: ["Uses creative energy", "Sense of accomplishment"]
        },
        {
          id: 18,
          title: "Goal Planning Session",
          description: "Set new goals or work on achieving current ones",
          category: "learning",
          duration: "30 mins",
          difficulty: "Medium",
          icon: BookOpen,
          benefits: ["Directs energy", "Builds future"]
        }
      ]
    };

    let suggestions = allSuggestions[mood] || allSuggestions.neutral;
    
    if (category !== 'all') {
      suggestions = suggestions.filter(s => s.category === category);
    }
    
    return suggestions;
  };

  const filteredSuggestions = getSuggestions(currentMood, selectedCategory);

  const quickActions = [
    { title: "2-Minute Breathing", duration: "2 mins", icon: Brain, action: "start-breathing" },
    { title: "Mood Check-in", duration: "1 min", icon: Heart, action: "mood-checkin" },
    { title: "Gratitude Note", duration: "3 mins", icon: BookOpen, action: "gratitude" },
    { title: "Stretch Break", duration: "5 mins", icon: Sun, action: "stretch" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Personalized Suggestions</h1>
          <p className="text-gray-600">Get customized recommendations based on your current mood and preferences</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center group"
              >
                <action.icon className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.duration}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Mood Selection */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
              <div className="space-y-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setCurrentMood(mood.value)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                      currentMood === mood.value
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mood.icon}</span>
                      <span className="font-medium text-gray-900">{mood.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                      selectedCategory === cat.value
                        ? 'bg-purple-100 border-2 border-purple-400'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900 text-sm">{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Mood Display */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white mb-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {moodOptions.find(m => m.value === currentMood)?.icon || '😐'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Feeling {moodOptions.find(m => m.value === currentMood)?.label || 'Neutral'}
                  </h2>
                  <p className="text-purple-100">
                    Here are some personalized suggestions to help you make the most of your current mood
                  </p>
                </div>
              </div>
            </div>

            {/* Suggestions Grid */}
            <div className="space-y-6">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                        <suggestion.icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{suggestion.title}</h3>
                          <div className="flex gap-2">
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {suggestion.duration}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              suggestion.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                              suggestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {suggestion.difficulty}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{suggestion.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                          <ul className="flex flex-wrap gap-2">
                            {suggestion.benefits.map((benefit, index) => (
                              <li key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                <Star className="w-3 h-3 inline mr-1" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Start Activity
                          </button>
                          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Brain className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No suggestions found</h3>
                  <p className="text-gray-500">Try selecting a different mood or category</p>
                </div>
              )}
            </div>

            {/* Emergency Resources */}
            <div className="mt-12 bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Need Immediate Support?</h3>
              <p className="text-red-700 mb-4">
                If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate help.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Crisis Hotline: 988
                </button>
                <button className="border border-red-400 hover:border-red-500 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Campus Counseling
                </button>
                <button className="border border-red-400 hover:border-red-500 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Emergency Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}