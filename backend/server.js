require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const ngrok = require('ngrok');  // Thêm ngrok
const app = express();

// Cấu hình CORS trước
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware đọc cookie và JSON từ request body
app.use(cookieParser());
app.use(express.json());

// Import routes
const openaiRoutes = require('./routes/openaiServer.routes');
const authRoutes = require('./routes/auth.routes');
const apiRoutes = require('./routes/api.routes');

// Routes API
app.use('/api/server', openaiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/payment', require('./routes/payment.router'));

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại'
  });
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Có lỗi xảy ra từ phía server'
  });
});

const PORT = process.env.PORT || 5000;

// Khởi động server sau khi kết nối database
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối database thành công.');

    // await sequelize.sync();
    // console.log('Database đã sync.');
    await sequelize.sync({ alter: true }).then(() => {
      console.log("Database updated!");
  }).catch(err => {
      console.error("Error updating database:", err);
  });
    app.listen(PORT,async  () => {
      console.log(`Server đang chạy trên port ${PORT}`);
      const url = await ngrok.connect(PORT);
      console.log(`Ngrok đang chạy tại ${url}`);
    });

  } catch (error) {
    console.error('Lỗi kết nối database:', error);
    process.exit(1); // Dừng server nếu database lỗi
  }
};

// Khởi chạy server
startServer();
