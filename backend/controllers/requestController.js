const { User } = require('../models');
const { sequelize } = require('../config/database');

const requestController = {
  // Mua request theo gói
  async buyRequest(req, res) {
    const { packageId } = req.body; // Gói request muốn mua
    const user = req.user;

    // Định nghĩa các gói request
    const requestPackages = {
      "small": { amount: 100, price: 5000 },   // 100 requests - 5,000 VND
      "medium": { amount: 500, price: 20000 }, // 500 requests - 20,000 VND
      "large": { amount: 1000, price: 35000 }, // 1000 requests - 35,000 VND
    };

    // Kiểm tra gói hợp lệ
    if (!requestPackages[packageId]) {
      return res.status(400).json({
        success: false,
        message: "Gói request không hợp lệ",
      });
    }

    const { amount, price } = requestPackages[packageId];

    // Kiểm tra số dư người dùng
    if (user.balance < price) {
      return res.status(400).json({
        success: false,
        message: "Số dư không đủ để mua gói request này",
      });
    }

    // Cập nhật số dư và số request
    await user.update({
      balance: sequelize.literal(`balance - ${price}`),
      request_limit: sequelize.literal(`request_limit + ${amount}`)
    });

    res.json({
      success: true,
      message: `Mua thành công ${amount} requests`,
      data: {
        remainingBalance: user.balance - price,
        newRequestLimit: user.request_limit + amount
      }
    });
  },

  // Kiểm tra số request còn lại
  async checkRequestLimit(req, res) {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      data: {
        request_limit: user.request_limit
      }
    });
  },

  // Ghi nhận việc sử dụng request khi gọi API
  async useRequest(req, res, next) {
    const user = req.user;

    if (user.request_limit <= 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn đã hết request. Vui lòng mua thêm để tiếp tục sử dụng.",
      });
    }

    // Trừ số lượng request còn lại
    await user.update({
      request_limit: sequelize.literal('request_limit - 1')
    });

    next(); // Tiếp tục xử lý API request
  }
};

module.exports = requestController;
