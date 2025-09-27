import { useState, useEffect, useCallback } from 'react';
import { authApiService, isAuthenticated, clearAuthTokens } from '../services/authApi';
import type { User, LoginCredentials, RegisterData, ChangePasswordData, ApiError } from '../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          const user = await authApiService.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error) {
          // Token might be invalid, clear it
          clearAuthTokens();
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: error as ApiError,
          });
        }
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const authResponse = await authApiService.login(credentials);
      setState({
        user: authResponse.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return authResponse;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const authResponse = await authApiService.register(userData);
      setState({
        user: authResponse.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return authResponse;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await authApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const updatedUser = await authApiService.updateProfile(userData);
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
        error: null,
      }));
      return updatedUser;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const changePassword = useCallback(async (passwordData: ChangePasswordData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApiService.changePassword(passwordData);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApiService.requestPasswordReset(email);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApiService.resetPassword(token, newPassword);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApiService.verifyEmail(token);
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApiService.resendVerificationEmail();
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      throw apiError;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    clearError,
  };
}

