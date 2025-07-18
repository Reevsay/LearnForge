const sequelize = require('./config/database');
const User = require('./models/User');
const LearningPath = require('./models/LearningPath');
const Quiz = require('./models/Quiz');
const Progress = require('./models/Progress');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } for development only
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();
