import { apiClient, API_ENDPOINTS } from '@/api';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types';

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
};
