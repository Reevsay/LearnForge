const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const learningPathRoutes = require('./routes/learningPaths');
const aiRoutes = require('./routes/ai'); // Confirm this line
require('dotenv').config();
require('./config/passport');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/ai', aiRoutes); // Confirm this line

sequelize.sync().then(() => console.log('PostgreSQL connected'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));