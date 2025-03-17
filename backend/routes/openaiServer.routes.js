const express = require('express');
const router = express.Router();
const openaiServerController = require('../controllers/openaiServer.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Routes công khai - không cần token
router.post('/register', openaiServerController.registerServer);
router.get('/available', openaiServerController.getAvailableServer);

// Routes yêu cầu xác thực
router.use(authenticateToken);
router.post('/servers/:server_id/complete', openaiServerController.completeRequest);
router.post('/servers/health-check', openaiServerController.healthCheck);

module.exports = router; 