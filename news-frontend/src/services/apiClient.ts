import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import type { ApiError } from '../types/api';

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  
  const client = axios.create({
    baseURL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for caching
      config.metadata = { startTime: new Date() };
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response time
      const endTime = new Date();
      const duration = endTime.getTime() - (response.config as any).metadata?.startTime?.getTime();
      console.log(`API Request to ${response.config.url} took ${duration}ms`);
      
      return response;
    },
    async (error: AxiosError) => {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
        apiError.message = (error.response.data as any)?.message || error.message;
        apiError.status = error.response.status;
        apiError.details = error.response.data;
      } else if (error.request) {
        // Request was made but no response received
        apiError.message = 'Network error - please check your connection';
        apiError.status = 0;
      }

      // Handle token expiration
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const response = await axios.post(`${baseURL}/auth/refresh`, {
              refresh_token: refreshToken,
            });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            
            // Retry original request
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${access_token}`;
              return client.request(error.config);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        } else {
          // No refresh token, redirect to login
          window.location.href = '/login';
        }
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}

