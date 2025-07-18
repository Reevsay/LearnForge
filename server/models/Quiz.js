const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const LearningPath = require('./LearningPath');

const Quiz = sequelize.define('Quiz', {
  question: { type: DataTypes.TEXT, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  difficulty: { type: DataTypes.ENUM('easy', 'medium', 'hard'), defaultValue: 'easy' },
  learningPathId: { type: DataTypes.INTEGER, references: { model: LearningPath, key: 'id' } },
});

LearningPath.hasMany(Quiz);
Quiz.belongsTo(LearningPath);

module.exports = Quiz;
