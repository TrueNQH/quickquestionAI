const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/checkapikey', apiController.checkApiKey);


router.use(authenticateToken);
// Thêm các routes API khác ở đây
router.post('/generate-api-key', apiController.generateApiKey);
router.get('/api-keys', apiController.listApiKeys);


module.exports = router;  // Đảm bảo export router
