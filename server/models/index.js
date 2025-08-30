const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for OAuth users
  },
  role: {
    type: DataTypes.ENUM('student', 'instructor', 'parent'),
    defaultValue: 'student',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true, // For display name
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

const LearningPath = sequelize.define('LearningPath', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

const Progress = sequelize.define('Progress', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  learningPathId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completion: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

const Quiz = sequelize.define('Quiz', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

// Define associations
User.hasMany(LearningPath, { foreignKey: 'userId' });
LearningPath.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

LearningPath.hasMany(Progress, { foreignKey: 'learningPathId' });
Progress.belongsTo(LearningPath, { foreignKey: 'learningPathId' });

User.hasMany(Quiz, { foreignKey: 'userId' });
Quiz.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, LearningPath, Progress, Quiz };