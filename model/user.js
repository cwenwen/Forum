const Sequelize = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(16),
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nickname: {
    type: Sequelize.STRING(64),
    allowNull: false
  } 
}, {
  timestamps: false,
  tableName: 'cwenwen_users',
})

User.sync();

module.exports = User;