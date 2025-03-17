import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useAuth } from "../../contexts/AuthContext";

const fetchData = async (apikey) => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxQjxP1gA-rH9LzKp-uSfCwi0TVrvzTH7mg1MuD73QGAxIVD66G-OsNna5uh_P2qfEC/exec";

  try {
    const response = await fetch(`${WEB_APP_URL}?api_key=${apikey}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Dữ liệu trả về không hợp lệ:", data);
      return [];
    }

    // Xử lý dữ liệu thành dạng { date: "YYYY-MM-DD", total: số lượng câu hỏi }
    const counts = data.reduce((acc, item) => {
      const date = item.date.split("T")[0]; // Lấy phần ngày từ timestamp
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([date, total]) => ({
      date, total
    }));
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

const OverviewChart = () => {
  const [overviewData, setOverviewData] = useState([]);
  const { apikey } = useAuth();

  // Dữ liệu mẫu khi chưa có dữ liệu từ API
  const sampleData = [
    { date: "2025-03-01", total: 5 },
    { date: "2025-03-02", total: 8 },
    { date: "2025-03-03", total: 12 },
    { date: "2025-03-04", total: 3 },
    { date: "2025-03-05", total: 7 },
  ];

  useEffect(() => {
    if (apikey) {
      fetchData(apikey).then(setOverviewData);
    }
  }, [apikey]);

  // Nếu chưa có dữ liệu, sử dụng dữ liệu mẫu
  const dataToRender = overviewData.length > 0 ? overviewData : sampleData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={dataToRender}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip cursor={false} formatter={(value) => `${value} câu hỏi`} />
        <XAxis
          dataKey="date"
          strokeWidth={0}
          stroke="#475569"
          tickMargin={6}
        />
        <YAxis
          dataKey="total"
          strokeWidth={0}
          stroke="#475569"
          tickMargin={6}
          tickFormatter={(value) => `${value}`}
        />
        <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default OverviewChart;
