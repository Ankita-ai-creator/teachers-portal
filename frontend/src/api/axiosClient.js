import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
});

// Intercept all outgoing requests and attach the JWT token if available
axiosClient.interceptors.request.use(
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

export default axiosClient;
