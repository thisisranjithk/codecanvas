import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/category/category.service';
import { queryKeys } from '@/api/query-keys';
import type { CategoryType } from '@/types/category.types';

export function useCategoryDropdown(type: CategoryType) {
  return useQuery({
    queryKey: queryKeys.categories.dropdown(type),
    queryFn: () => categoryService.getDropdown(type),
  });
}
