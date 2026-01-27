import axios from 'axios';

const instance = axios.create({
  // Ek baar yahan set kar diya, ab har jagah yahi use hoga
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001'
});

export default instance;