import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project/project.service';
import { queryKeys } from '@/api/query-keys';

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: async () => {
      const response = await projectService.getProject(id);
      return response.data;
    },
    enabled: !!id,
  });
}
