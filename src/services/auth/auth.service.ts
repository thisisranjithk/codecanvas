import { apiClient, API_ENDPOINTS } from '@/api';
import type { ApiResponse, LoginRequest, LoginResponse, MeResponse } from '@/types';

export const authService = {
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data).then((res) => res.data);
  },

  getCurrentUser(): Promise<ApiResponse<MeResponse>> {
    return apiClient.get(API_ENDPOINTS.AUTH.ME).then((res) => res.data);
  },
};
