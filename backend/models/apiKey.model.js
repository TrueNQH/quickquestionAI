const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
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
    unique: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  free_trial_expiry: {
    type: DataTypes.DATE,
    allowNull: true, // Cột này có thể là NULL nếu không có giá trị
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ApiKey;
