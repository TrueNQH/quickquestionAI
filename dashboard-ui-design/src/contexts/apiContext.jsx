import React, { createContext, useContext, useState, useEffect } from "react";

const ApiContext = createContext();

export const useApi = () => {
  return useContext(ApiContext);
};

export const ApiProvider = ({ children }) => {
  const [historyData, sethistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apikey } = useAuth(); // Giả sử bạn có AuthContext để lấy API key

  useEffect(() => {
    const fetchData = async () => {
      const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQjxP1gA-rH9LzKp-uSfCwi0TVrvzTH7mg1MuD73QGAxIVD66G-OsNna5uh_P2qfEC/exec";
      
      try {
        const response = await fetch(`${WEB_APP_URL}?api_key=${apikey}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          sethistoryData(data.map(item => ({ ...item, rated: false }))); // Thêm trạng thái "rated" ban đầu là false
        } else {
          setError("Invalid data received");
        }
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (apikey) {
      fetchData();
    }
  }, [apikey]);

  return (
    <ApiContext.Provider value={{ historyData, loading, error }}>
      {children}
    </ApiContext.Provider>
  );
};
