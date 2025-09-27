import { apiClient } from './apiClient';
import type { AuthResponse, User, ApiResponse } from '../types/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export class AuthApiService {
  private readonly baseUrl = '/auth';

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
    
    // Store tokens in localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, userData);
    
    // Store tokens in localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/refresh`, {
      refresh_token: refreshToken,
    });
    
    // Update tokens
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    return response.data;
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/me`);
    return response.data;
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.patch<User>(`${this.baseUrl}/me`, userData);
    return response.data;
  }

  // Change password
  async changePassword(passwordData: ChangePasswordData): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/change-password`, passwordData);
    return response.data;
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/password-reset`, { email });
    return response.data;
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/password-reset-confirm`, {
      token,
      password: newPassword,
    });
    return response.data;
  }

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/verify-email`, { token });
    return response.data;
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>(`${this.baseUrl}/resend-verification`);
    return response.data;
  }
}

// Create service instance
export const authApiService = new AuthApiService();

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

