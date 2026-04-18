import axios from 'axios';

// For local development, assume backend runs on 8080
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Needed if using session cookies for OAuth2
});

// Response interceptor to manage global error formats
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We pass the error back so components can handle specific 409 conflicts
    return Promise.reject(error);
  }
);

export default api;
