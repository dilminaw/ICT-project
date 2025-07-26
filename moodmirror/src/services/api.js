// moodmirror/src/services/api.js

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.accessToken = null;
    this.refreshToken = null;
  }

  setTokens({ accessToken, refreshToken }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async request(endpoint, method = 'GET', data = null, customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      method,
      headers,
      credentials: 'include', // for cookies if needed
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(this.baseURL + endpoint, config);

    // Try to parse JSON, fallback to text
    let responseData;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw responseData;
    }
    return responseData;
  }

  // Auth
  async login(email, password) {
    return this.request('/auth/login', 'POST', { email, password });
  }

  async register(username, email, password) {
    return this.request('/auth/register', 'POST', { username, email, password });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', 'POST', { email });
  }

  async refreshTokenRequest() {
    return this.request('/auth/refresh-token', 'POST', { refreshToken: this.refreshToken });
  }

  // User
  async getProfile() {
    return this.request('/users/profile', 'GET');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', 'PUT', profileData);
  }

  async changePassword(oldPassword, newPassword) {
    return this.request('/users/change-password', 'POST', { oldPassword, newPassword });
  }

  // Emotions
  async analyzeEmotion(formData) {
    // For file uploads, use FormData and adjust headers
    const headers = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    const response = await fetch(this.baseURL + '/emotions/analyze', {
      method: 'POST',
      headers, // Don't set Content-Type for FormData
      body: formData,
      credentials: 'include',
    });
    if (!response.ok) {
      throw await response.json();
    }
    return await response.json();
  }

  async getEmotionHistory() {
    return this.request('/emotions/history', 'GET');
  }

  async getEmotionTrends() {
    return this.request('/emotions/trends', 'GET');
  }

  // Progress
  async getProgressOverview() {
    return this.request('/progress/overview', 'GET');
  }

  async getProgressTrends() {
    return this.request('/progress/trends', 'GET');
  }

  // Admin
  async getAdminDashboard() {
    return this.request('/admin/dashboard', 'GET');
  }
}

const apiService = new ApiService();
export default apiService;