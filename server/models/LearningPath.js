const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const LearningPath = sequelize.define('LearningPath', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('active', 'completed', 'pending'), defaultValue: 'pending' },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
});

User.hasMany(LearningPath);
LearningPath.belongsTo(User);

module.exports = LearningPath;