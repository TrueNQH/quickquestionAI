const rateLimit = require('express-rate-limit');
const { ApiServer } = require('../models');

const createServerLimiter = (server) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: server.max_concurrent_requests,
    message: {
      success: false,
      message: 'Quá nhiều request, vui lòng thử lại sau'
    }
  });
};

module.exports = { createServerLimiter }; 