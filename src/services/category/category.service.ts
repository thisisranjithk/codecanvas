import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { CategoryType, CategoryDropdownItem } from '@/types/category.types';

export const categoryService = {
  getDropdown: async (type: CategoryType): Promise<CategoryDropdownItem[]> => {
    const response = await apiClient.get<ApiResponse<CategoryDropdownItem[]>>(
      API_ENDPOINTS.CATEGORIES.DROPDOWN,
      {
        params: { type },
      }
    );
    return response.data.data;
  },
};
