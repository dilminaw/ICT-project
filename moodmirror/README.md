# MoodMirror - Mental Health Companion

A Real-Time Mental Health Companion Mirror for Students Using Multimodal Emotion Detection

## 🚀 Features

- **Multimodal Emotion Detection**: Face, voice, and body language analysis
- **Real-time AI Analysis**: Instant mood assessment and recommendations
- **Progress Tracking**: Monitor your mental health journey over time
- **Personalized Insights**: AI-generated recommendations based on your patterns
- **Secure Authentication**: JWT-based user authentication
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Admin Dashboard**: Comprehensive analytics and user management

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd moodmirror
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp config.env.example .env

# Edit .env file with your configuration
# See Configuration section below

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to the project root
cd moodmirror

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/moodmirror

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
moodmirror/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── assets/            # Static assets
├── backend/               # Backend source code
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic services
│   └── uploads/           # File upload directory
├── public/                # Public assets
└── package.json           # Frontend dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete account
- `GET /api/users/stats` - Get user statistics

### Emotion Analysis
- `POST /api/emotions/analyze` - Analyze emotions from media
- `GET /api/emotions/history` - Get emotion history
- `GET /api/emotions/trends` - Get emotion trends
- `GET /api/emotions/:id` - Get specific emotion record
- `DELETE /api/emotions/:id` - Delete emotion record

### Progress Tracking
- `GET /api/progress/overview` - Get progress overview
- `GET /api/progress/trends` - Get detailed trends
- `GET /api/progress/insights` - Get AI insights
- `GET /api/progress/goals` - Get progress goals

### Admin (Admin users only)
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get specific user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/records` - Get all records

## 🎯 Usage

### 1. Registration/Login
- Visit the application and create an account
- Or log in with existing credentials

### 2. Emotion Analysis
- Navigate to the "Check Your Mood" page
- Choose analysis type: Face, Voice, or Body
- Capture or upload media files
- Add your mood rating and notes
- Click "Analyze Emotions" to get results

### 3. Progress Tracking
- View your progress overview
- Check trends and patterns
- Read AI-generated insights
- Track your goals

### 4. Admin Features (Admin users)
- Access admin dashboard
- Manage users
- View analytics
- Monitor system health

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **File Upload Security**: Validated file types and sizes
- **Error Handling**: Secure error responses

## 🧪 AI Integration

The application includes mock AI analysis for demonstration purposes. To integrate real AI services:

### Face Analysis
- Azure Face API
- AWS Rekognition
- Google Vision API

### Voice Analysis
- Azure Speech Services
- AWS Transcribe
- Google Speech-to-Text

### Body Language Analysis
- Azure Video Indexer
- AWS Rekognition Video
- Google Video Intelligence

Update the `backend/services/emotionAnalysis.js` file with your preferred AI service integrations.

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Build and Start**
   ```bash
   npm install
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred hosting service**
   - Vercel
   - Netlify
   - AWS S3
   - Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time video analysis
- [ ] Mobile app development
- [ ] Integration with wearable devices
- [ ] Advanced AI models
- [ ] Multi-language support
- [ ] Therapist dashboard
- [ ] Emergency contact system
- [ ] Mood prediction algorithms

---

**Note**: This is a demonstration project. For production use, ensure proper security measures, data privacy compliance, and professional medical oversight.
