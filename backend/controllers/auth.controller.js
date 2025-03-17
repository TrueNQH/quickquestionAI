const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { addDays } = require('date-fns');
const e = require('express');

const authController = {
  // xử lý đăng nhập google
  
  
  async googleLogin(req, res) { 
    try {
        const { name, email, avatar, password } = req.body;

        // Kiểm tra nếu model User chưa được import đúng
        if (!User) {
            throw new Error("User model is not defined");
        }

        // Kiểm tra xem user đã tồn tại hay chưa
        let user = await User.findOne({ where: { email } });

        // Nếu chưa có user, tạo user mới
        if (!user) {
            user = await User.create({
                email,
                name,
                avatar,
                password,
                balance: 0,
                free_trial_expiry: addDays(new Date(), 7)
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('jwt', token, {
          httpOnly: true, // Ngăn chặn truy cập từ JavaScript (bảo mật hơn)
          
          sameSite: 'Strict', // Ngăn chặn CSRF
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
        // Gửi response
        res.json({
            success: true,
            message: 'Đăng nhập Google thành công',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    balance: user.balance,
                    free_trial_expiry: user.free_trial_expiry
                },
                token
            }
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi đăng nhập Google'
        });
    }
}
,
  // Đăng ký tài khoản mới
  async register(req, res) {
    try {
      const { email, password, name, avatar } = req.body;

      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }

      // Tạo user mới với gói dùng thử 3 ngày
      const user = await User.create({
        email,
        password,
        name,
        avatar,
        balance: 0,
        free_trial_expiry: addDays(new Date(), 3)
      });

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            balance: user.balance,
            free_trial_expiry: user.free_trial_expiry
          },
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng ký tài khoản'
      });
    }
  },

  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Tìm user theo email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác'
        });
      }

      // Kiểm tra password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không chính xác'
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token có thời hạn 7 ngày
      );

      // Thiết lập cookie HttpOnly
      res.cookie('jwt', token, {
        httpOnly: true, // Ngăn chặn truy cập từ JavaScript (bảo mật hơn)
       // Chỉ dùng secure nếu ở production
        sameSite: 'Strict', // Ngăn chặn CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
      });

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            balance: user.balance,
            free_trial_expiry: user.free_trial_expiry
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng nhập'
      });
    }
  },

  // Đăng xuất (Xóa cookie)
  logout(req, res) {
    res.cookie('jwt', '', {
      httpOnly: true,
      
      sameSite: 'Strict',
      expires: new Date(0) // Xóa cookie
    });

    res.json({ success: true, message: 'Đã đăng xuất' });
  },


  // Lấy thông tin user
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email','avatar', 'balance','request_limit', 'free_trial_expiry']
      });

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thông tin người dùng'
      });
    }
  }
};

module.exports = authController; 