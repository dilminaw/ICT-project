import { Link } from 'react-router-dom';
import { Camera, Brain, TrendingUp, Users, Shield, Heart, Star, ArrowRight } from 'lucide-react';
import faceScan from '../assets/face-scan.png';

export default function HomePage() {
  const features = [
    {
      icon: Camera,
      title: "Real-time Emotion Detection",
      description: "Advanced AI analyzes facial expressions, voice, and text to understand your emotional state instantly."
    },
    {
      icon: Brain,
      title: "Personalized Insights",
      description: "Get customized mental health recommendations based on your unique emotional patterns."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your emotional well-being over time with detailed analytics and trend reports."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your emotional data is encrypted and secure. Complete control over your personal information."
    }
  ];

  const benefits = [
    "24/7 emotional support companion",
    "Evidence-based mental health techniques",
    "Personalized coping strategies",
    "Mood pattern recognition",
    "Professional guidance integration"
  ];

  const stats = [
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "Available" },
    { number: "1000+", label: "Students Helped" },
    { number: "5★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 opacity-20 rounded-full blur-3xl animate-ping" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-6xl lg:text-7xl font-bold text-purple-900 mb-6 leading-tight">
                Mood<span className="text-purple-600">Mirror</span>
              </h1>
              <p className="text-2xl text-gray-700 mb-4 leading-relaxed">
                A Real-Time Mental Health Companion
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Using advanced multimodal emotion detection, MoodMirror helps students understand and improve their mental well-being through personalized insights and support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  to="/scan" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Start Emotion Scan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Join MoodMirror
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <img
                  src={faceScan}
                  alt="MoodMirror Emotion Detection"
                  className="w-96 h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 ease-in-out"
                />
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How MoodMirror Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology combined with evidence-based mental health practices to provide comprehensive emotional support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h2 className="text-4xl font-bold mb-6">
                Why Choose MoodMirror?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Empower your mental health journey with cutting-edge technology and compassionate care.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <Star className="w-5 h-5 text-yellow-300" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link 
                  to="/login" 
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Student Success Story
                </h3>
                <blockquote className="text-lg italic mb-4">
                  "MoodMirror helped me understand my stress patterns and provided personalized techniques that really work. My academic performance and overall well-being have improved significantly."
                </blockquote>
                <div className="text-center">
                  <div className="font-semibold">Sarah M.</div>
                  <div className="opacity-80">Computer Science Student</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are taking control of their mental well-being with MoodMirror.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Users className="w-6 h-6" />
              Create Free Account
            </Link>
            <Link 
              to="/scan" 
              className="text-purple-600 hover:text-purple-700 font-semibold text-xl transition-all duration-300 flex items-center gap-2"
            >
              <Camera className="w-6 h-6" />
              Try Demo Scan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
