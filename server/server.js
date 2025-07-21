const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const learningPathRoutes = require('./routes/learningPaths');
const aiRoutes = require('./routes/ai');
require('dotenv').config();
require('./config/passport');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(passport.initialize());

console.log('Loading routes:', { authRoutes, learningPathRoutes, aiRoutes }); // Debug log
app.use('/api/auth', authRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/ai', aiRoutes);

sequelize.authenticate()
  .then(() => console.log('Neon database connected successfully'))
  .catch(err => console.error('Neon database connection error:', err.message));
sequelize.sync().then(() => console.log('Neon database synced')).catch(err => console.error('Sync failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));