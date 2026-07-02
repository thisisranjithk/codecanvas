import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types';
import type { Education, CreateEducationRequest, UpdateEducationRequest } from '@/types/education.types';

export const educationService = {
  getEducations(): Promise<ApiResponse<Education[]>> {
    return apiClient.get<ApiResponse<Education[]>>(API_ENDPOINTS.EDUCATIONS.LIST).then((res) => res.data);
  },

  getEducation(id: string): Promise<ApiResponse<Education>> {
    return apiClient.get<ApiResponse<Education>>(API_ENDPOINTS.EDUCATIONS.DETAIL(id)).then((res) => res.data);
  },

  createEducation(payload: CreateEducationRequest): Promise<ApiResponse<Education>> {
    return apiClient.post<ApiResponse<Education>>(API_ENDPOINTS.EDUCATIONS.CREATE, payload).then((res) => res.data);
  },

  updateEducation(id: string, payload: UpdateEducationRequest): Promise<ApiResponse<Education>> {
    return apiClient.put<ApiResponse<Education>>(API_ENDPOINTS.EDUCATIONS.UPDATE(id), payload).then((res) => res.data);
  },

  deleteEducation(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.EDUCATIONS.DELETE(id)).then((res) => res.data);
  },
};
