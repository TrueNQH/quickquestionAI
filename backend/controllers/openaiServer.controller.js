const { ApiServer } = require('../models');
const axios = require('axios');

const openaiServerController = {
  // Đăng ký server mới - không cần xác thực
  async registerServer(req, res) {
    try {
      const { name, url, model_type, max_concurrent_requests } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!name || !url || !model_type) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc (name, url, model_type)'
        });
      }

      // Kiểm tra server có tồn tại
      const existingServer = await ApiServer.findOne({ where: { url } });
      if (existingServer) {
        // Nếu server đã tồn tại, cập nhật thông tin
        await existingServer.update({
          name,
          model_type,
          max_concurrent_requests: max_concurrent_requests || existingServer.max_concurrent_requests,
          status: 'active',
          health_status: true,
          last_health_check: new Date()
        });

        return res.json({
          success: true,
          message: 'Cập nhật thông tin server thành công',
          data: { server: existingServer }
        });
      }

      

      // Tạo server mới
      const server = await ApiServer.create({
        name,
        url,
        model_type,
        max_concurrent_requests: max_concurrent_requests || 5,
        status: 'active',
        health_status: true,
        last_health_check: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Đăng ký server thành công',
        data: { server }
      });
    } catch (error) {
      console.error('Register server error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng ký server',
        error: error.message
      });
    }
  },

  // Lấy server phù hợp cho request
  async getAvailableServer(req, res) {
    try {
        let { model_type } = req.query;

        // Kiểm tra model_type hợp lệ
        if (!model_type) {
            return res.status(400).json({
                success: false,
                message: "Thiếu model_type"
            });
        }

        // Tìm danh sách server theo model_type và đang active
        const servers = await ApiServer.findAll({
            where: {
                model_type,
                status: 'active'
            },
            order: [['current_requests', 'ASC']] // Sắp xếp theo số request đang xử lý
        });

        if (!servers.length) {
            return res.status(503).json({
                success: false,
                message: "Không có server khả dụng"
            });
        }

        let selectedServer = null;

        for (const server of servers) {
            try {
                // Gọi health check của server
                const healthResponse = await axios.get(`${server.url}/health`, { timeout: 3000 });

                // Nếu server khỏe mạnh, chọn server này
                if (healthResponse.data.status === 'healthy') {
                    selectedServer = server;
                    break;
                } else {
                    console.warn(`⚠️ Server ${server.url} báo không khỏe mạnh. Đang xóa khỏi database...`);
                    await server.destroy(); // Xóa server khỏi database
                }
            } catch (error) {
                console.error(`❌ Health check thất bại cho server ${server.url}:`, error.message);
                console.warn(`⚠️ Đang xóa server ${server.url} khỏi database do lỗi health check...`);
                await server.destroy(); // Xóa server khỏi database
            }
        }

        if (!selectedServer) {
            return res.status(503).json({
                success: false,
                message: "Không có server nào khả dụng sau khi kiểm tra sức khỏe"
            });
        }

        // Tăng số lượng request hiện tại
        await selectedServer.increment(['current_requests', 'total_requests']);

        return res.json({
            success: true,
            data: {
                server_url: selectedServer.url,
                server_id: selectedServer.id
            }
        });

    } catch (error) {
        console.error('❌ Lỗi lấy server:', error.message);
        return res.status(500).json({
            success: false,
            message: "Lỗi lấy server"
        });
    }
},


  // Cập nhật trạng thái sau khi hoàn thành request
  async completeRequest(req, res) {
    try {
      const { server_id } = req.params;

      const server = await ApiServer.findByPk(server_id);
      if (!server) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy server'
        });
      }

      // Giảm số request hiện tại
      await server.decrement('current_requests');

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công'
      });
    } catch (error) {
      console.error('Complete request error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi cập nhật trạng thái'
      });
    }
  },

  // Health check định kỳ
  async healthCheck(req, res) {
    try {
      const servers = await ApiServer.findAll({
        where: { status: 'active' }
      });

      for (const server of servers) {
        try {
          await axios.get(`${server.url}/health`);
          await server.update({
            health_status: true,
            last_health_check: new Date()
          });
        } catch (error) {
          await server.update({
            health_status: false,
            last_health_check: new Date()
          });
        }
      }

      res.json({
        success: true,
        message: 'Health check completed'
      });
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi health check'
      });
    }
  }
};

module.exports = openaiServerController; 