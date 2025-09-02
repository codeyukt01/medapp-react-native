import axios from 'axios';
import { useAuthStore } from '../store';
import { logoutAndNavigateToLogin } from '../utils/navigation';

const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://192.168.29.97:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (e.g., for auth tokens)
api.interceptors.request.use(
  async (config) => {
    console.log('API Request:', config);
    // Add auth token from Zustand if available
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (e.g., for error handling)
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.log('API Response Error:', error.response?.data);
    
    // Handle authentication errors (401/403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Token invalid, logging out user');
      // Clear auth state
      useAuthStore.getState().logout();
      
      // Navigate to login screen
      logoutAndNavigateToLogin();
    }
    
    let customError = {
      message: 'An unknown error occurred',
      status: undefined,
      data: undefined,
      isNetworkError: false,
      isTimeout: false,
    };
    if (error.response) {
      // Server responded with a status code outside 2xx
      customError = {
        message: error.response?.data?.error || error.response.data?.message || error.response.statusText || 'Server error',
        status: error.response.status,
        data: error.response.data,
        isNetworkError: false,
        isTimeout: false,
      };
    } else if (error.request) {
      // No response received
      customError = {
        message: 'No response from server',
        status: undefined,
        data: undefined,
        isNetworkError: true,
        isTimeout: error.code === 'ECONNABORTED',
      };
    } else if (error.message && error.message.includes('timeout')) {
      customError = {
        message: 'Request timed out',
        status: undefined,
        data: undefined,
        isNetworkError: false,
        isTimeout: true,
      };
    }
    return Promise.reject(customError);
  }
);

export const apiGet = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

export const apiPost = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.post<T>(url, data, config);
  return response.data;
};

export const apiPut = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

export const apiDelete = async <T = any>(url: string, config?: any): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api; 