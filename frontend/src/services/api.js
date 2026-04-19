import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for OAuth2 session cookies
});

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (not logged in), redirect to login page
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
