const { Sequelize, DataTypes } = require('sequelize');
    const sequelize = require('../config/database');

    const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for OAuth
      },
      role: {
        type: DataTypes.ENUM('student', 'instructor'),
        defaultValue: 'student',
      },
    }, {
      timestamps: true,
    });

    module.exports = { User };