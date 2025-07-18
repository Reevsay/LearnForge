const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('student', 'instructor', 'parent'), defaultValue: 'student' },
  googleId: { type: DataTypes.STRING },
});

module.exports = User;