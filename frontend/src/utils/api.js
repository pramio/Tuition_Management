import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2001/api',
  withCredentials: false, // change to true if using cookies
});

// Log the base URL for debugging (only on client side)
if (typeof window !== 'undefined') {
  console.log('API baseURL =', api.defaults.baseURL);
}

// Add request interceptor to attach token
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Add response interceptor to handle unauthorized access
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default api;
