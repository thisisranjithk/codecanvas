import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types';
import type { Project, ProjectsListResponse, CreateProjectRequest, UpdateProjectRequest } from '@/types/project.types';

export const projectService = {
  getProjects(): Promise<ApiResponse<ProjectsListResponse>> {
    return apiClient.get<ApiResponse<ProjectsListResponse>>(API_ENDPOINTS.PROJECTS.LIST).then((res) => res.data);
  },

  getProject(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.DETAIL(id)).then((res) => res.data);
  },

  createProject(payload: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return apiClient.post<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.CREATE, payload).then((res) => res.data);
  },

  updateProject(id: string, payload: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return apiClient.put<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.UPDATE(id), payload).then((res) => res.data);
  },

  deleteProject(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.PROJECTS.DELETE(id)).then((res) => res.data);
  },
};
