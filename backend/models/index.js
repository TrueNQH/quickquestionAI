const sequelize = require('../config/database');
const ApiServer = require('./apiServer.model');
const User = require('./user.model');
const ApiKey = require('./apiKey.model');
User.hasOne(ApiKey, { foreignKey: 'user_id', as: 'apiKey' });
ApiKey.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
module.exports = {
  sequelize,
  ApiServer,
  ApiKey,
  User
};
