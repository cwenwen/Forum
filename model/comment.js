const Sequelize = require('sequelize');
const sequelize = require('./db');
const User = require('../model/user');

const Comment = sequelize.define('comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  parentId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  topic: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false,
  tableName: 'cwenwen_comments',
})

Comment.sync();

module.exports = Comment;