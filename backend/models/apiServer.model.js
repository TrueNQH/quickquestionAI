const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiServer = sequelize.define('ApiServer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  model_type: {
    type: DataTypes.STRING, // ví dụ: 'gpt-3.5-turbo', 'gpt-4' etc.
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'overload'),
    defaultValue: 'active'
  },
  current_requests: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_concurrent_requests: {
    type: DataTypes.INTEGER,
    defaultValue: 5 // Số request đồng thời tối đa
  },
  total_requests: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  health_status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_health_check: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'api_servers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ApiServer;
