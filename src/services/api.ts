import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { DOMAIN_API_URI } from './apiConstants';
import { ApiResponse } from '@/types/api';

/**
 * Global Logout Trigger
 * Clears local storage and redirects to login page.
 */
const globalLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Core Axios Instance Configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: DOMAIN_API_URI,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches Authorization: Bearer <token> to all requests except unprotected ones.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (CRITICAL BUSINESS LOGIC)
 * Handles custom backend 'rid' codes and standardizes response/error handling.
 */
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { rid, message } = response.data;

    // 1. Token Expiry Check
    if (rid === 'e-auth-14' || rid === 'e-auth-2') {
      globalLogout();
      return Promise.reject(message || 'Session expired. Please login again.');
    }

    // 2. Standard Backend Error Check
    if (rid && rid.startsWith('e-')) {
      return Promise.reject(message || 'A backend error occurred.');
    }

    // 3. Success Case
    if (rid && rid.startsWith('s-')) {
      return response.data as any; // Return the full response data for success
    }

    // Fallback for unexpected formats
    return response.data;
  },
  (error: AxiosError) => {
    // Handle standard HTTP errors (non-200)
    const errorMessage = (error.response?.data as ApiResponse)?.message || error.message || 'An unexpected error occurred.';
    
    // Check for 401 Unauthorized as a fallback
    if (error.response?.status === 401) {
      globalLogout();
    }

    return Promise.reject(errorMessage);
  }
);

/**
 * Common API Wrapper Functions
 */

export const get = async <T>(url: string, params?: any): Promise<T> => {
  return await api.get(url, { params });
};

export const post = async <T>(url: string, data?: any): Promise<T> => {
  return await api.post(url, data);
};

export const put = async <T>(url: string, data?: any): Promise<T> => {
  return await api.put(url, data);
};

export const patch = async <T>(url: string, data?: any): Promise<T> => {
  return await api.patch(url, data);
};

export const del = async <T>(url: string, data?: any): Promise<T> => {
  return await api.delete(url, { data });
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
};
