import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "../api/api.config"; // ✅ Import API Axios config

// Tạo context để quản lý trạng thái người dùng
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái tải user
  const [apikey, setApiKey] = useState(null); // ✅ Lưu API key
  const [tableData, setTableData] = useState([]); // Lưu dữ liệu table từ API
  const [dataLoading, setDataLoading] = useState(false); // Trạng thái tải dữ liệu từ API
  const [error, setError] = useState(null); // Lỗi khi gọi API

  // ✅ Kiểm tra đăng nhập khi mở trang
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("api/auth/me"); // API lấy user từ backend
        console.log(res.data.data.user);
        
        setUser(res.data.data.user);
      } catch (error) {
        setUser(null); // Nếu lỗi, xóa user
        navigator("/login"); // Chuyển hướng đến trang đăng nhập
      } finally {
        setLoading(false); // Đã hoàn thành tải user
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData); // Lưu thông tin người dùng khi đăng nhập
  };

  // ✅ Hàm logout (Xóa session từ backend)
  const logout = async () => {
    try {
      // Gọi API logout
      await api.get('api/auth/logout');
      
      // Xóa thông tin người dùng khỏi context hoặc localStorage
      setUser(null);
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  // ✅ Hàm lưu API key
  const saveKey = (key) => {
    setApiKey(key);
  };

  // ✅ Hàm gọi API để lấy dữ liệu và lưu vào context
  const fetchData = async () => {
    if (!apikey) return;
    setDataLoading(true);
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQjxP1gA-rH9LzKp-uSfCwi0TVrvzTH7mg1MuD73QGAxIVD66G-OsNna5uh_P2qfEC/exec";
    
    try {
      const response = await fetch(`${WEB_APP_URL}?api_key=${apikey}`);
      const data = await response.json();

      if (!Array.isArray(data)) {
        setError("Invalid data received");
        return;
      }

      setTableData(data.map(item => ({ ...item, rated: false }))); // Thêm trạng thái "rated" ban đầu là false
    } catch (error) {
      setError("Error fetching data");
      console.error(error);
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      logout, 
      loading, 
      login, 
      apikey, 
      saveKey, 
      tableData, 
      fetchData, 
      dataLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
