import { useState, useEffect } from 'react';
import { Users, BarChart3, Shield, Settings, TrendingUp, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';
import apiService from '../services/api.js';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAdminDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalScans: 15634,
      avgMoodScore: 7.2,
      criticalAlerts: 3,
      systemUptime: '99.8%'
    },
    userGrowth: [
      { month: 'Jan', users: 450 },
      { month: 'Feb', users: 620 },
      { month: 'Mar', users: 780 },
      { month: 'Apr', users: 950 },
      { month: 'May', users: 1120 },
      { month: 'Jun', users: 1247 }
    ],
    recentActivity: [
      { id: 1, user: 'Sarah M.', action: 'Completed emotion scan', time: '2 mins ago', type: 'scan' },
      { id: 2, user: 'John D.', action: 'Registered account', time: '5 mins ago', type: 'registration' },
      { id: 3, user: 'Emma K.', action: 'Accessed suggestions', time: '8 mins ago', type: 'activity' },
      { id: 4, user: 'Alex R.', action: 'Updated profile', time: '12 mins ago', type: 'profile' },
      { id: 5, user: 'System', action: 'Daily backup completed', time: '1 hour ago', type: 'system' }
    ],
    alerts: [
      { id: 1, type: 'critical', message: 'User reported severe depression symptoms', time: '30 mins ago' },
      { id: 2, type: 'warning', message: 'High stress levels detected in Computer Science students', time: '2 hours ago' },
      { id: 3, type: 'info', message: 'Weekly report generation completed', time: '4 hours ago' }
    ]
  };

  const data = dashboardData || mockData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System Health', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.totalUsers.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-1">+8% this month</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.activeUsers.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-1">+12% this week</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.totalScans.toLocaleString()}</p>
              <p className="text-green-600 text-sm mt-1">+24% this month</p>
            </div>
            <Brain className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Mood Score</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.avgMoodScore}/10</p>
              <p className="text-green-600 text-sm mt-1">+0.3 this week</p>
            </div>
            <TrendingUp className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.criticalAlerts}</p>
              <p className="text-red-600 text-sm mt-1">Requires attention</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Uptime</p>
              <p className="text-3xl font-bold text-gray-900">{data.overview.systemUptime}</p>
              <p className="text-green-600 text-sm mt-1">Last 30 days</p>
            </div>
            <Shield className="w-12 h-12 text-indigo-500" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
          <div className="space-y-4">
            {data.userGrowth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 w-12">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(item.users / 1400) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-16 text-right">{item.users}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'scan' ? 'bg-purple-500' :
                  activity.type === 'registration' ? 'bg-green-500' :
                  activity.type === 'activity' ? 'bg-blue-500' :
                  activity.type === 'profile' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
        <div className="space-y-4">
          {data.alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'critical' ? 'bg-red-50 border-red-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.type === 'critical' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <span className="font-medium text-gray-900">{alert.message}</span>
                </div>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Export Users
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">University</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Active</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Scans</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Sarah Johnson', email: 'sarah.j@university.edu', university: 'MIT', lastActive: '2 hours ago', scans: 45, status: 'active' },
                { name: 'Michael Chen', email: 'm.chen@university.edu', university: 'Stanford', lastActive: '1 day ago', scans: 32, status: 'active' },
                { name: 'Emma Williams', email: 'emma.w@university.edu', university: 'Harvard', lastActive: '3 days ago', scans: 28, status: 'inactive' },
                { name: 'James Brown', email: 'j.brown@university.edu', university: 'Yale', lastActive: '5 hours ago', scans: 67, status: 'active' }
              ].map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.university}</td>
                  <td className="py-3 px-4 text-gray-600">{user.lastActive}</td>
                  <td className="py-3 px-4 text-gray-600">{user.scans}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Emotion Distribution</h3>
          <div className="space-y-4">
            {[
              { emotion: 'Happy', percentage: 35, color: 'bg-green-500' },
              { emotion: 'Neutral', percentage: 25, color: 'bg-gray-500' },
              { emotion: 'Stressed', percentage: 20, color: 'bg-orange-500' },
              { emotion: 'Sad', percentage: 12, color: 'bg-blue-500' },
              { emotion: 'Anxious', percentage: 8, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${item.color}`} />
                <span className="font-medium text-gray-700 flex-1">{item.emotion}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 rounded-full h-2 w-24">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Peak Usage Hours</h3>
          <div className="space-y-3">
            {[
              { hour: '9 AM', usage: 85 },
              { hour: '12 PM', usage: 92 },
              { hour: '3 PM', usage: 78 },
              { hour: '6 PM', usage: 95 },
              { hour: '9 PM', usage: 67 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium text-gray-700 w-16">{item.hour}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-8">{item.usage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">CPU Usage</h3>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">23%</p>
          <p className="text-sm text-gray-600">Normal</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Memory</h3>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">67%</p>
          <p className="text-sm text-gray-600">Moderate</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Database</h3>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">12ms</p>
          <p className="text-sm text-gray-600">Response time</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">API Status</h3>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-3xl font-bold text-gray-900">99.9%</p>
          <p className="text-sm text-gray-600">Uptime</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor system performance and manage MoodMirror platform</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-600 border-l-4 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'analytics' && renderAnalytics()}
              {activeTab === 'system' && renderSystem()}
              {activeTab === 'settings' && (
                <div className="text-center py-20">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Settings Panel</h3>
                  <p className="text-gray-500">Configure system settings and preferences</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}