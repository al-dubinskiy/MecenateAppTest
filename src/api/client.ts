import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { ErrorResponse, ErrorCode } from './types';

const API_BASE_URL = 'https://k8s.mectest.ru/test-app';

class ApiClient {
  private client: AxiosInstance;
  private userId: string;

  constructor() {
    // Use a fixed test UUID (any valid UUID works)
    this.userId = '550e8400-e29b-41d4-a716-446655440000';
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${this.userId}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              console.error('Authentication failed:', data?.error?.message);
              break;
            case 404:
              console.error('Resource not found:', data?.error?.message);
              break;
            case 400:
              console.error('Validation error:', data?.error?.message);
              break;
            case 500:
              console.error('Server error:', data?.error?.message);
              break;
            default:
              console.error(`API Error (${status}):`, data?.error?.message);
          }
        } else if (error.request) {
          console.error('Network error: No response received');
        } else {
          console.error('Request error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  setUserId(id: string) {
    this.userId = id;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export const client = apiClient.getClient();