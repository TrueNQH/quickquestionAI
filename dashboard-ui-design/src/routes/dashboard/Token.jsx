import React, { useState, useEffect } from "react";
import api from "../../api/api.config";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme"; // Sử dụng hook để xác định theme

const TokenGenerator = () => {
  const { theme } = useTheme();
  const { user, apikey, saveKey } = useAuth();

  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // ✅ Thêm trạng thái loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/api-keys");
        console.log("API Response:", response.data);

        if (response.data.data.apiKeys.length > 0) {
          saveKey(response.data.data.apiKeys[0].api_key);
          setApiKey(response.data.data.apiKeys[0].api_key);
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
        setMessage("Failed to fetch API keys");
        setShowCopyMessage(true);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const generateNewToken = async () => {
    setIsGenerating(true); // ✅ Bật trạng thái loading

    try {
      const res = await api.post("/api/generate-api-key", {});
      console.log("API Response:", res.data);
      
      setApiKey(res.data.data.apiKey);
      setMessage("API Key created successfully! 🎉");
      setShowCopyMessage(true);
    } catch (error) {
      setMessage("Error generating API Key");
      setShowCopyMessage(true);
      console.error("Lỗi khi tạo API Key:", error);
    } finally {
      setIsGenerating(false); // ✅ Tắt loading sau khi hoàn thành
      setTimeout(() => setShowCopyMessage(false), 3000); // ✅ Ẩn thông báo sau 3 giây
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) {
      setMessage("No API Key to copy!");
      setShowCopyMessage(true);
      return;
    }

    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        setMessage("Token copied to clipboard!");
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      })
      .catch((err) => {
        console.error("Lỗi khi sao chép API Key:", err);
      });
  };

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-full max-w-6xl p-6 rounded-lg shadow-md transition-colors 
        ${theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"}`}
      >
        <h1 className="text-2xl font-semibold text-center">Your AuthToken</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
          This is your personal AuthToken. Use this to authenticate the ngrok agent that you downloaded.
        </p>

        <div className="mt-6 flex items-center space-x-4">
          <input
            type={showToken ? "text" : "password"}
            value={apiKey || "************"}
            className={`w-full p-2 border rounded-lg transition-colors
            ${theme === "light" ? "text-gray-700 border-gray-300" : "text-gray-100 border-gray-600 bg-gray-700"}`}
            readOnly
          />

          <div className="flex space-x-4">
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Copy
            </button>

            <button
              onClick={toggleTokenVisibility}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showToken ? "Hide" : "Show"}
            </button>

            <button
              onClick={generateNewToken}
              className={`px-4 py-2 rounded-lg text-white transition-colors 
                ${isGenerating ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
              disabled={isGenerating}
            >
              {isGenerating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>

        {showCopyMessage && (
          <div className={`mt-4 text-center font-medium ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenGenerator;
