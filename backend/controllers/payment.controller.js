const axios = require('axios');
const { User } = require('../models'); // Import model User
const { addDays } = require('date-fns'); // Hàm để thêm ngày

// Hàm lấy dữ liệu từ Google Sheets
async function fetchTransactionData() {
  try {
    console.log('Bắt đầu gọi API Google Sheets...');
    const response = await axios.get('https://script.google.com/macros/s/AKfycby4wOl6bfDIFJpvhQ96Pcu2kcr7p7X1aY3Qhya3x8mT7GoHfVLx86pwq--Y9b-drBtR/exec');
    
    console.log('Dữ liệu trả về từ Google Sheets:', response.data);

    if (response.data && Array.isArray(response.data)) {
      console.log('Dữ liệu hợp lệ, đang phân tích...');
      // Phân tích và trả về các giao dịch
      const transactions = response.data.map(record => {
        const regex1 = /(\d{2}\/\d{2} \d{2}:\d{2})\nTài khoản: (\d+)\nSố tiền: \(([\+\-])\) ([0-9,]+ VND)\nSố dư: [0-9,]+ VND\nNội dung:(.*)\n?/;
        const match = record.match(regex1);

        if (match) {
          // Trả về thông tin đã phân tích
          return {
            time: match[1],
            account: match[2],
            transaction_type: match[3] === "+" ? "Credit" : "Debit",
            amount: parseInt(match[4].replace(/,/g, '')), // Chuyển đổi tiền tệ
            content: match[5].trim(),
          };
        }
        return null;
      }).filter(item => item !== null); // Lọc các giao dịch hợp lệ

      console.log('Danh sách giao dịch:', transactions);
      return transactions;
    } else {
      console.error('Dữ liệu trả về không hợp lệ');
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    throw new Error('Không thể lấy dữ liệu từ Google Sheets');
  }
}

async function handleQRCode(req, res) {
  const { amount, code } = req.body; // Lấy thông tin từ request body
  
  if (!amount || !code) {
    return res.status(400).json({ message: 'Thiếu thông tin amount hoặc code' });
  }

  console.log('Thông tin nhận được từ client:', { amount, code });

  try {
    // Gọi hàm fetchTransactionData để lấy tất cả các giao dịch
    const transactions = await fetchTransactionData();
    
    console.log('Danh sách giao dịch sau khi gọi API:', transactions);
    
    // Tìm giao dịch có mã code và số tiền khớp
    const matchedTransaction = transactions.find(transaction => 
      transaction.content === code && transaction.amount === parseInt(amount)
    );

    if (matchedTransaction) {
      console.log('Giao dịch khớp:', matchedTransaction);

      // Cập nhật thông tin người dùng trong cơ sở dữ liệu (update free_trial_expiry)
      // Lấy user từ request (yêu cầu rằng user đã được xác thực trước đó)
      const userId = req.user.id;  // Lấy user id từ token JWT hoặc session

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Kiểm tra xem free_trial_expiry đã hết hạn chưa
      const currentDate = new Date();

      if (user.free_trial_expiry && new Date(user.free_trial_expiry) < currentDate) {
        // Nếu ngày hết hạn dùng thử đã qua, đặt lại free_trial_expiry
        user.free_trial_expiry = addDays(currentDate, 3); // Cộng 3 ngày từ ngày hiện tại
      } else {
        // Nếu chưa hết hạn, cộng thêm 3 ngày vào free_trial_expiry hiện tại
        user.free_trial_expiry = addDays(new Date(user.free_trial_expiry), 3);
      }

      await user.save();

      // Trả về thông tin giao dịch
      return res.status(200).json({
        message: 'Giao dịch thành công và thời gian dùng thử đã được gia hạn!',
        transaction: matchedTransaction,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          free_trial_expiry: user.free_trial_expiry,
        }
      });
    } else {
      console.log('Không tìm thấy giao dịch khớp với mã code và số tiền này.');
      // Nếu không tìm thấy giao dịch khớp
      return res.status(404).json({
        message: 'Không tìm thấy giao dịch khớp với mã code và số tiền này.'
      });
    }
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý giao dịch:', error);
    return res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình xử lý giao dịch.'
    });
  }
}

module.exports = {
  handleQRCode
};
