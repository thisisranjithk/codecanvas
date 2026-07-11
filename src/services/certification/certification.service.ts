import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type {
  Certification,
  CreateCertificationRequest,
  UpdateCertificationRequest,
} from '@/types/certification.types';

export const certificationService = {
  getCertifications(): Promise<ApiResponse<Certification[]>> {
    return apiClient
      .get<ApiResponse<Certification[]>>(API_ENDPOINTS.CERTIFICATIONS.LIST)
      .then((res) => res.data);
  },

  getCertification(id: string): Promise<ApiResponse<Certification>> {
    return apiClient
      .get<ApiResponse<Certification>>(API_ENDPOINTS.CERTIFICATIONS.DETAIL(id))
      .then((res) => res.data);
  },

  createCertification(payload: CreateCertificationRequest): Promise<ApiResponse<Certification>> {
    return apiClient
      .post<ApiResponse<Certification>>(API_ENDPOINTS.CERTIFICATIONS.CREATE, payload)
      .then((res) => res.data);
  },

  updateCertification(
    id: string,
    payload: UpdateCertificationRequest
  ): Promise<ApiResponse<Certification>> {
    return apiClient
      .put<ApiResponse<Certification>>(API_ENDPOINTS.CERTIFICATIONS.UPDATE(id), payload)
      .then((res) => res.data);
  },

  deleteCertification(id: string): Promise<ApiResponse<null>> {
    return apiClient
      .delete<ApiResponse<null>>(API_ENDPOINTS.CERTIFICATIONS.DELETE(id))
      .then((res) => res.data);
  },
};
