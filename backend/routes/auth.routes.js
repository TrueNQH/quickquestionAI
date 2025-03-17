const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Routes công khai - không cần token
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logingoogle', authController.googleLogin);
router.get('/logout', authController.logout);

// Routes yêu cầu xác thực
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router; 