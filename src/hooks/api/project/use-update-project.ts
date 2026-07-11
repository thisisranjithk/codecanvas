import { useMutation } from '@tanstack/react-query';
import { projectService } from '@/services/project/project.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { UpdateProjectRequest } from '@/types/project.types';

export function useUpdateProject() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectService.updateProject(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(queryKeys.projects.detail(variables.id), response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.lists() });
    },
  });
}
