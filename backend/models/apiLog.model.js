const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiLog = sequelize.define('ApiLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  api_key: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'ApiKeys',
      key: 'api_key'
    }
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  response_status: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  response_time: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'timestamp',
  updatedAt: false
});

module.exports = ApiLog;
