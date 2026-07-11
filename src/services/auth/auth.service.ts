import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, ApiResponse, LoginResponse, MeResponse, RegisterResponse } from '@/types';

export const authService = {
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data).then((res) => res.data);
  },

  register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data).then((res) => res.data);
  },

  getCurrentUser(): Promise<ApiResponse<MeResponse>> {
    return apiClient.get(API_ENDPOINTS.AUTH.ME).then((res) => res.data);
  },

  refresh(): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post(API_ENDPOINTS.AUTH.REFRESH).then((res) => res.data);
  },

  logout(): Promise<ApiResponse<void>> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).then((res) => res.data);
  },
  changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data).then((res) => res.data);
  },

  deleteAccount(): Promise<ApiResponse<void>> {
    return apiClient.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT).then((res) => res.data);
  },
};
