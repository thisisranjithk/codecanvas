import { useMutation } from '@tanstack/react-query';
import { projectService } from '@/services/project/project.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { CreateProjectRequest } from '@/types/project.types';

export function useCreateProject() {
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
