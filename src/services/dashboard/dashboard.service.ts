import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse, DashboardData } from '@/types';

class DashboardService {
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>(API_ENDPOINTS.DASHBOARD.STATS);
    return data;
  }
}

export const dashboardService = new DashboardService();
