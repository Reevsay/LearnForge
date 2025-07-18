const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const LearningPath = require('./LearningPath');

const Progress = sequelize.define('Progress', {
  completion: { type: DataTypes.FLOAT, defaultValue: 0 },
  module: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  learningPathId: { type: DataTypes.INTEGER, references: { model: LearningPath, key: 'id' } },
});

User.hasMany(Progress);
Progress.belongsTo(User);
LearningPath.hasMany(Progress);
Progress.belongsTo(LearningPath);

module.exports = Progress;
