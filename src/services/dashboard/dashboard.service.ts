import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse, DashboardData } from '@/types';

export const dashboardService = {
  getDashboard(): Promise<ApiResponse<DashboardData>> {
    return apiClient.get<ApiResponse<DashboardData>>(API_ENDPOINTS.DASHBOARD.STATS).then((res) => res.data);
  },
};
