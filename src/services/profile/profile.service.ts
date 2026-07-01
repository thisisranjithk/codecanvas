import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { 
  ApiResponse, 
  Profile, 
  CreateProfileRequest, 
  UpdateProfileRequest, 
  PortfolioSettings,
  UpdatePortfolioSettingsRequest
} from '@/types';

export const profileService = {
  getProfile(): Promise<ApiResponse<Profile>> {
    return apiClient.get<ApiResponse<Profile>>(API_ENDPOINTS.PROFILE.GET).then((res) => res.data);
  },

  createProfile(payload: CreateProfileRequest): Promise<ApiResponse<Profile>> {
    return apiClient.post<ApiResponse<Profile>>(API_ENDPOINTS.PROFILE.CREATE, payload).then((res) => res.data);
  },

  updateProfile(payload: UpdateProfileRequest): Promise<ApiResponse<Profile>> {
    return apiClient.put<ApiResponse<Profile>>(API_ENDPOINTS.PROFILE.UPDATE, payload).then((res) => res.data);
  },

  getPortfolioSettings(): Promise<ApiResponse<PortfolioSettings>> {
    return apiClient.get<ApiResponse<PortfolioSettings>>(API_ENDPOINTS.PROFILE.PORTFOLIO_SETTINGS).then((res) => res.data);
  },

  updatePortfolioSettings(payload: UpdatePortfolioSettingsRequest): Promise<ApiResponse<PortfolioSettings>> {
    return apiClient.put<ApiResponse<PortfolioSettings>>(API_ENDPOINTS.PROFILE.PORTFOLIO_SETTINGS, payload).then((res) => res.data);
  },
};
