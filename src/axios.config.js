import axios from 'axios';

const instance = axios.create({
  // Single place to control API base URL (local by default)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001'
});

// Attach JWT automatically (if present)
instance.interceptors.request.use((config) => {
  // Avoid crashing during non-browser builds/tests
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default instance;