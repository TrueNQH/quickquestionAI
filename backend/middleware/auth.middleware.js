const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ HttpOnly cookie
    
    const token = req.cookies.jwt; 

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Bạn chưa đăng nhập' 
      });
    }

    // Giải mã JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem user có tồn tại không
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    req.user = user; // Gán thông tin user vào request để sử dụng trong các route tiếp theo
    next();
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' 
    });
  }
};


// Middleware kiểm tra API key


module.exports = {
  authenticateToken,
  
}; 