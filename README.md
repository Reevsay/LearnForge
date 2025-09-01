# 🔥 LearnForge

A modern, AI-powered learning platform that creates personalized learning paths and interactive quizzes using Google Gemini AI. Forge your knowledge with intelligent, adaptive learning experiences.

## 🌟 Features

- **AI-Powered Learning Paths**: Generate personalized learning content using Google Gemini
- **Interactive Quizzes**: Create and take AI-generated quizzes with detailed explanations
- **User Authentication**: Secure login/registration with JWT tokens
- **Progress Tracking**: Monitor learning journey and achievements  
- **Modern UI**: Beautiful dark theme with enhanced animations
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smart Results**: Get detailed explanations for wrong answers to improve learning

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Beautiful React components
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - Object-Relational Mapping (ORM)
- **PostgreSQL** - Database (Neon Cloud)
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Google Gemini AI** - AI content generation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (or use Neon Cloud)
- **Google Gemini API Key**

## 🚀 Quick Start (One Command)

**Want to run everything with just one command?** 

```bash
python run_app.py
```

This script will automatically:
- ✅ Check dependencies
- ✅ Install npm packages
- ✅ Setup environment files
- ✅ Start both servers
- ✅ Open the application in your browser

See [QUICK_START.md](QUICK_START.md) for more options including Windows batch files.

## ⚙️ Manual Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Reevsay/LearnForge.git
cd LearnForge
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
# Database Configuration (Neon PostgreSQL)
DB_HOST=your-neon-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Database Setup
The application will automatically create and sync database tables when you first run the server.

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application
Open your browser and navigate to: **http://localhost:5173**

## 📱 Usage

### 1. Register/Login
- Create a new account or login with existing credentials
- Secure authentication with JWT tokens

### 2. Dashboard
- View your learning paths and progress
- Create new learning paths with AI assistance

### 3. Quiz Generator
- Generate quizzes on any topic using AI
- Take interactive multiple-choice quizzes
- Get instant feedback and scoring

### 4. Learning Paths
- Create personalized learning journeys
- AI-generated content and structure
- Track progress and completion

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Learning Paths
- `GET /api/learning-paths` - Get user's learning paths
- `POST /api/learning-paths` - Create new learning path

### AI Generation
- `POST /api/ai/generate` - Generate AI content (learning paths, quizzes)

### Progress Tracking
- `GET /api/progress/:pathId` - Get progress for a learning path
- `POST /api/progress` - Update progress

## 🏗️ Project Structure

```
smart-learning-path/
├── 📁 client/                 # Frontend React application
│   ├── 📁 public/             # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable React components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 services/       # API services
│   │   ├── 📁 utils/          # Utility functions
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
├── 📁 server/                 # Backend Node.js application
│   ├── 📁 config/             # Configuration files
│   ├── 📁 controllers/        # Route controllers
│   ├── 📁 middleware/         # Custom middleware
│   ├── 📁 models/             # Database models
│   ├── 📁 routes/             # API routes
│   ├── 📁 utils/              # Server utilities
│   ├── server.js              # Main server file
│   └── package.json
├── 📁 docs/                   # Documentation
├── .env.example               # Environment variables template
├── .gitignore
└── README.md
```

## 🔐 Environment Variables

### Server (.env)
```env
# Database
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true

# Authentication
JWT_SECRET=your-jwt-secret-key

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment (Heroku/Railway/Vercel)
1. Set environment variables in your hosting platform
2. Ensure database connection is configured
3. Deploy the `server` directory

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Yash Verma** - *Initial work* - [Reevsay](https://github.com/Reevsay)

## 🙏 Acknowledgments

- Google Gemini AI for powerful content generation
- Material-UI for beautiful React components
- Neon for reliable PostgreSQL hosting
- React and Node.js communities

## 📞 Support

If you have any questions or issues, please:
1. Check the [documentation](docs/)
2. Create an [issue](https://github.com/Reevsay/smart-learning-path/issues)
3. Contact the maintainers

---

**Made with ❤️ and AI** 🤖 - AI-Powered Learning Platform

A full-stack application that uses AI to generate personalized learning paths and quizzes.

## Features

- 🤖 AI-powered learning path generation using Google Gemini
- 📝 AI quiz generation for any topic
- 🔐 User authentication (local + OAuth with Google/GitHub)
- 📊 Progress tracking
- 👨‍🎓 Role-based access (student, instructor, parent)
- 📱 Responsive dark-themed UI

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd smart-learning-path

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Copy the environment example file:
```bash
cp .env.example .env
```

Edit `.env` file and add your API keys:

#### Required API Keys:

**GEMINI_API_KEY** (Required for AI features):
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

**JWT_SECRET** (Required for authentication):
- Generate a random string (at least 32 characters)
- Add it to your `.env` file

#### Optional API Keys:

**Google OAuth** (for Google login):
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

**GitHub OAuth** (for GitHub login):
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
4. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env`

### 4. Database Setup (Optional)

By default, the app uses SQLite. For production, configure PostgreSQL:
1. Set up a PostgreSQL database
2. Add database credentials to `.env`
3. Uncomment database configuration in `.env`

### 5. Run the Application

Start the backend server:
```bash
cd server
npm start
```

Start the frontend (in a new terminal):
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
smart-learning-path/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database and passport config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── package.json
├── .env                  # Environment variables (not in git)
├── .env.example         # Environment template
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### AI Services
- `POST /api/ai/generate` - Generate AI content

### Learning Paths
- `GET /api/learning-paths` - Get user's learning paths
- `POST /api/learning-paths` - Create new learning path

### Progress
- `POST /api/progress` - Save progress
- `GET /api/progress/:learningPathId` - Get progress for path

## Usage

1. **Register/Login**: Create an account or use OAuth
2. **Create Learning Path**: Enter a topic and description
3. **AI Generation**: The system generates a detailed learning path
4. **Generate Quiz**: Create quizzes for any topic
5. **Track Progress**: Monitor your learning progress

## Troubleshooting

### Common Issues:

1. **AI features not working**: Check your `GEMINI_API_KEY` in `.env`
2. **Login issues**: Verify `JWT_SECRET` is set
3. **OAuth not working**: Check OAuth credentials and redirect URLs
4. **CORS errors**: Ensure backend is running on port 5000

### Error Messages:
- "GEMINI_API_KEY is not set": Add your Gemini API key to `.env`
- "Invalid credentials": Check your login details
- "Failed to generate": API key issue or network problem

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
