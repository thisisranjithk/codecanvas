import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types';
import type { Experience, CreateExperienceRequest, UpdateExperienceRequest } from '@/types/experience.types';

export const experienceService = {
  getExperiences(): Promise<ApiResponse<Experience[]>> {
    return apiClient.get<ApiResponse<Experience[]>>(API_ENDPOINTS.EXPERIENCES.LIST).then((res) => res.data);
  },

  getExperience(id: string): Promise<ApiResponse<Experience>> {
    return apiClient.get<ApiResponse<Experience>>(API_ENDPOINTS.EXPERIENCES.DETAIL(id)).then((res) => res.data);
  },

  createExperience(payload: CreateExperienceRequest): Promise<ApiResponse<Experience>> {
    return apiClient.post<ApiResponse<Experience>>(API_ENDPOINTS.EXPERIENCES.CREATE, payload).then((res) => res.data);
  },

  updateExperience(id: string, payload: UpdateExperienceRequest): Promise<ApiResponse<Experience>> {
    return apiClient.put<ApiResponse<Experience>>(API_ENDPOINTS.EXPERIENCES.UPDATE(id), payload).then((res) => res.data);
  },

  deleteExperience(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.EXPERIENCES.DELETE(id)).then((res) => res.data);
  },
};
