import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types';
import type { Skill, CreateSkillRequest, UpdateSkillRequest } from '@/types/skill.types';

export const skillService = {
  getSkills(): Promise<ApiResponse<Skill[]>> {
    return apiClient.get<ApiResponse<Skill[]>>(API_ENDPOINTS.SKILLS.LIST).then((res) => res.data);
  },

  getSkill(id: string): Promise<ApiResponse<Skill>> {
    return apiClient.get<ApiResponse<Skill>>(API_ENDPOINTS.SKILLS.DETAIL(id)).then((res) => res.data);
  },

  createSkill(payload: CreateSkillRequest): Promise<ApiResponse<Skill>> {
    return apiClient.post<ApiResponse<Skill>>(API_ENDPOINTS.SKILLS.CREATE, payload).then((res) => res.data);
  },

  updateSkill(id: string, payload: UpdateSkillRequest): Promise<ApiResponse<Skill>> {
    return apiClient.put<ApiResponse<Skill>>(API_ENDPOINTS.SKILLS.UPDATE(id), payload).then((res) => res.data);
  },

  deleteSkill(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.SKILLS.DELETE(id)).then((res) => res.data);
  },
};

