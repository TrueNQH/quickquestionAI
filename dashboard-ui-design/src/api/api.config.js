import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // Cho phép gửi cookie với request
});

export default api;
