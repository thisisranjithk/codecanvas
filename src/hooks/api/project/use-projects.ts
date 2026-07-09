import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project/project.service';
import { queryKeys } from '@/api/query-keys';
import type { ProjectsQueryParams } from '@/types/project.types';

type ProjectsFilters = Pick<ProjectsQueryParams, 'status' | 'categoryId'>;

export function useProjects(filters: ProjectsFilters = {}) {
  const params: ProjectsQueryParams = {
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
  };

  return useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: async () => {
      const response = await projectService.getProjects(params);
      return response.data.data;
    },
  });
}
