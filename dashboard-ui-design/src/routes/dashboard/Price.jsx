import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme"; // Giả sử bạn đã có hook use-theme
import Modal from "@/components/Modal"; // Giả sử bạn đã có Modal component // Đảm bảo axios đã được cài đặt
import api from "../../api/api.config";

function Price() {
  const { theme } = useTheme(); // Lấy thông tin theme từ hook
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(60); // Đếm ngược 60 giây
  const [paymentData, setPaymentData] = useState(null); // Lưu trữ dữ liệu thanh toán

  useEffect(() => {
    if (countdown === 0) {
      handleCancel();
    }
  }, [countdown]);

  const handleGetStartedClick = (plan) => {
    setShowModal(true);
    setCountdown(90); // Đặt lại thời gian đếm ngược

    // Tạo mã QR và chuẩn bị dữ liệu để gửi
    const code = `ID${Math.floor(Math.random() * 1000000)}`; // Tạo mã ngẫu nhiên
    const amount = plan.price.replace('₫', '').replace(',', '').trim(); // Xử lý số tiền từ giá dịch vụ

    setPaymentData({
      amount,
      code,
      qrCodeUrl: `https://img.vietqr.io/image/OCB-0386306595-compact.png?amount=${amount}&addInfo=${code}`,
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleComplete = async () => {
    // Gửi yêu cầu POST tới API khi hoàn tất thanh toán
    if (!paymentData) return;

    const { amount, code } = paymentData;

    try {
      const response = await api.post('/api/payment/handle-qr', {
        amount,
        code,
      });

      // Xử lý phản hồi từ API
      if (response.status === 200) {
        console.log("Giao dịch thành công!", response.data);
        
        alert("Giao dịch thành công!");
      } else {
        alert("Giao dịch không thành công, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu thanh toán:", error);
      alert("Đã xảy ra lỗi trong quá trình thanh toán.");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <section id="pricing" className={`relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin] ${theme === "dark" ? "bg-gray-800 text-gray-100 pt-10 " : "text-gray-900 "}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: "Free Trial",
              price: "0₫",
              features: ["Dùng thử 3 ngày miễn phí", "Hỗ trợ nhiều ngôn ngữ", "Chạy được trên Windows, macOS, Linux", "Nhận diện văn bản chính xác"]
            },
            {
              name: "Pro",
              price: "10,000₫",
              period: "₫/ngày",
              features: ["Hỗ trợ nhiều ngôn ngữ", "Nhận diện văn bản chính xác hơn", "Lưu lại lịch sử câu hỏi", "Xuất kết quả scan ra PDF"]
            },
            {
              name: "Premium",
              price: "50,000₫",
              period: "₫/tuần",
              features: ["Hỗ trợ nhiều ngôn ngữ", "Hỗ trợ ưu tiên", "Lưu lại lịch sử câu hỏi", "Xuất kết quả scan ra PDF"]
            },
            {
              name: "Offline Model",
              price: "?₫",
              period: "/tháng",
              features: ["Sử dụng được khi không kết nối mạng", "Hỗ trợ nhiều ngôn ngữ", "Nhận diện văn bản chính xác hơn"]
            }
          ].map((plan, index) => (
            <div key={index} className={`p-8 rounded-lg border hover:shadow-lg transition ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}>
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-gray-500">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg transition ${
                index !== 0 
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`} onClick={() => handleGetStartedClick(plan)}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && paymentData && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4">Payment Information</h3>
            <div className="mb-4">
              <span className="text-lg">Time remaining: {countdown}s</span>
            </div>
          
            <img src={paymentData.qrCodeUrl} alt="QR Code" className="mb-4" />
            <div className="text-center mb-4">
              <p className="text-lg">Người nhận: NGUYEN QUANG HUY</p>
              <p className="text-sm">Số tài khoản: 0386306595</p>
              <p className="text-sm">Ngân hàng OCB</p>
            </div>
            <div className="flex space-x-4">
              <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Hủy
              </button>
              <button onClick={handleComplete} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Hoàn tất
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

export default Price;
