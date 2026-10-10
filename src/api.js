import axios from 'axios';

// Read API URL from environment (supports Vite VITE_API_URL and CRA REACT_APP_API_BASE_URL)
const API_BASE_URL =
  (typeof process !== 'undefined' && (process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_URL)) ||
  'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically inject JWT token into requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gracefully handle 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
    }
    return Promise.reject(error);
  }
);

export default api;
