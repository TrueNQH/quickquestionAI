const express = require('express');
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Mua request theo gói
router.post('/buy', authMiddleware, requestController.buyRequest);

// Kiểm tra số request còn lại
router.get('/check', authMiddleware, requestController.checkRequestLimit);

// Trừ số lượng request khi gọi API
router.post('/use', authMiddleware, requestController.useRequest);

module.exports = router;
