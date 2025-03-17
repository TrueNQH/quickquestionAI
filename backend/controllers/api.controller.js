const { v4: uuidv4 } = require('uuid');
const { User, ApiKey, ApiLog, sequelize } = require('../models');
const { addDays, isAfter,isBefore } = require('date-fns');

const apiController = {
  // Tạo API key mới
  async generateApiKey(req, res) {
    const t = await sequelize.transaction();
    try {
        const user = req.user;

        // Kiểm tra số dư
        if (user.balance <= 0 && isAfter(new Date(), user.free_trial_expiry)) {
            return res.status(400).json({
                success: false,
                message: 'Số dư không đủ để tạo API key mới'
            });
        }

        // Kiểm tra xem user đã có API key hay chưa
        const existingApiKey = await ApiKey.findOne({
            where: { user_id: user.id }
        });

        let updatedApiKey;

        if (existingApiKey) {
            // Nếu đã có API key, cập nhật nó
            await existingApiKey.update(
                { api_key: uuidv4(), status: 'active' },
                { transaction: t }
            );
            updatedApiKey = existingApiKey.api_key;
        } else {
            // Nếu chưa có API key, tạo mới
            const newApiKey = await ApiKey.create({
                user_id: user.id,
                api_key: uuidv4(),
                status: 'active'
            }, { transaction: t });

            updatedApiKey = newApiKey.api_key;
        }

        await t.commit();

        res.json({
            success: true,
            message: 'API key đã được cập nhật',
            data: { apiKey: updatedApiKey }
        });

    } catch (error) {
        await t.rollback();
        console.error('Generate API key error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật API key'
        });
    }
},

 
  

  // Đăng ký gói ngày
  async subscribeDailyPlan(req, res) {
    const t = await sequelize.transaction();
    try {
      const user = req.user;
      const { days } = req.body;

      if (!days || days < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số ngày không hợp lệ'
        });
      }

      const costPerDay = 10000; // 10,000 VND/ngày
      const totalCost = days * costPerDay;

      if (user.balance < totalCost) {
        return res.status(400).json({
          success: false,
          message: 'Số dư không đủ'
        });
      }

      // Cập nhật số dư và thời hạn
      await user.update({
        balance: sequelize.literal(`balance - ${totalCost}`),
        free_trial_expiry: addDays(new Date(), days)
      }, { transaction: t });

      await t.commit();

      res.json({
        success: true,
        message: 'Đăng ký gói thành công',
        data: {
          remainingBalance: user.balance - totalCost,
          expiryDate: addDays(new Date(), days)
        }
      });
    } catch (error) {
      await t.rollback();
      console.error('Subscribe plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng ký gói'
      });
    }
  },

  // Kiểm tra số dư
  async checkBalance(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      
      res.json({
        success: true,
        data: {
          balance: user.balance,
          free_trial_expiry: user.free_trial_expiry
        }
      });
    } catch (error) {
      console.error('Check balance error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra số dư'
      });
    }
  },

  // Ghi log sử dụng API
  async logApiUsage(req, res) {
    try {
      const { endpoint, responseStatus, responseTime } = req.body;
      const apiKey = req.apiKey;

      await ApiLog.create({
        user_id: req.user.id,
        api_key: apiKey.api_key,
        endpoint,
        response_status: responseStatus,
        response_time: responseTime
      });

      res.json({
        success: true,
        message: 'Ghi log thành công'
      });
    } catch (error) {
      console.error('Log API usage error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi ghi log'
      });
    }
  },

  // Liệt kê API keys
  async listApiKeys(req, res) {
    try {
      const apiKeys = await ApiKey.findAll({
        where: { user_id: req.user.id },
        attributes: ['api_key', 'status', 'created_at']
      });

      res.json({
        success: true,
        data: { apiKeys }
      });
    } catch (error) {
      console.error('List API keys error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách API keys'
      });
    }
  },

  // Test API
  async testApi(req, res) {
    try {
      res.json({
        success: true,
        message: 'API hoạt động bình thường',
        data: {
          timestamp: new Date(),
          apiKey: req.apiKey.api_key
        }
      });
    } catch (error) {
      console.error('Test API error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi test API'
      });
    }
  }, // check Api key
  async checkApiKey(req, res) {
    try {
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                success: false,
                message: "Thiếu API key"
            });
        }

        // Tìm API key trong database
        const apiKeyData = await ApiKey.findOne({ where: { api_key: apiKey } });

        if (!apiKeyData) {
            return res.status(404).json({
                success: false,
                message: "API key không tồn tại"
            });
        }

        return res.json({
            success: true,
            message: "API key hợp lệ và tồn tại"
        });

    } catch (error) {
        console.error('Lỗi khi kiểm tra API key:', error);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi kiểm tra API key"
        });
    }
}

  
};

module.exports = apiController;
