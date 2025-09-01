const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const learningPathRoutes = require('./routes/learningPaths');
const aiRoutes = require('./routes/ai');
const progressRoutes = require('./routes/progress');
const quizRoutes = require('./routes/quiz');
require('dotenv').config();
require('./config/passport');

const app = express();
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true 
}));
app.use(express.json());
app.use(passport.initialize());

console.log('Loading routes:', { authRoutes, learningPathRoutes, aiRoutes, progressRoutes, quizRoutes }); // Debug log
app.use('/api/auth', authRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);

sequelize.authenticate()
  .then(() => console.log('Neon database connected successfully'))
  .catch(err => console.error('Neon database connection error:', err.message));
sequelize.sync().then(() => console.log('Neon database synced')).catch(err => console.error('Sync failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 LearnForge Backend Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`💾 Database: ${process.env.DATABASE_URL ? '✅ Configured' : '❌ Not configured'}`);
  console.log('='.repeat(60));
  console.log('🎯 Ready to accept AI generation requests!');
  console.log('='.repeat(60) + '\n');
});