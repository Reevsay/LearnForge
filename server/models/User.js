const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true }, // Allow null for OAuth users
  role: { type: DataTypes.ENUM('student', 'instructor', 'parent'), defaultValue: 'student' },
  name: { type: DataTypes.STRING, allowNull: true }, // For display name
  googleId: { type: DataTypes.STRING, allowNull: true },
  githubId: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true,
});

module.exports = User;