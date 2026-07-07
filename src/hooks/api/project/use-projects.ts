import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project/project.service';
import { queryKeys } from '@/api/query-keys';

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.lists(),
    queryFn: async () => {
      const response = await projectService.getProjects();
      return response.data.data;
    },
  });
}
