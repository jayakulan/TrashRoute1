import axios, { AxiosInstance } from 'axios';
import { ApiResponse, User, PickupRequest, Company, WasteCategory } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
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
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Pickup request endpoints
  async createPickupRequest(pickupData: Partial<PickupRequest>): Promise<ApiResponse<PickupRequest>> {
    try {
      const response = await this.api.post('/pickup-requests', pickupData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPickupRequests(userId: string): Promise<ApiResponse<PickupRequest[]>> {
    try {
      const response = await this.api.get(`/pickup-requests?userId=${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPickupRequestById(id: string): Promise<ApiResponse<PickupRequest>> {
    try {
      const response = await this.api.get(`/pickup-requests/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Company endpoints
  async getNearbyCompanies(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<ApiResponse<Company[]>> {
    try {
      const response = await this.api.get(
        `/companies/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCompanyById(id: string): Promise<ApiResponse<Company>> {
    try {
      const response = await this.api.get(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Waste category endpoints
  async getWasteCategories(): Promise<ApiResponse<WasteCategory[]>> {
    try {
      const response = await this.api.get('/waste-categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Helper method to handle errors
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const errorMessage = error.response.data.error?.message || 'An error occurred';
      return new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    } else {
      // Error setting up request
      return new Error('Error setting up request');
    }
  }
}

export const apiService = new ApiService();
export default apiService; 