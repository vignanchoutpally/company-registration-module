import axios from 'axios';

// Ensure we always hit the backend on port 5050 (or REACT_APP_API_URL if set)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

// Log once to help debug wrong base URLs (e.g., falling back to frontend dev server)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[API] baseURL =', API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Better error logging
    if (!error.response) {
      console.error('Network Error:', error.message);
      console.error('Make sure backend server is running on', process.env.REACT_APP_API_URL);
    }
    
    return Promise.reject(error);
  }
);

export default api;
