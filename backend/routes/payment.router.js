const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');


router.use(authenticateToken);
// Thêm các routes API khác ở đây
router.post('/handle-qr', paymentController.handleQRCode);



module.exports = router;  // Đảm bảo export router
