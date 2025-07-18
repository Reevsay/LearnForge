const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const learningPathRoutes = require('./routes/learningPaths');
require('dotenv').config();
require('./config/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/learning-paths', learningPathRoutes);

// Database sync
sequelize.sync().then(() => console.log('PostgreSQL connected'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));