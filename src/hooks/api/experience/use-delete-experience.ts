import { useMutation } from '@tanstack/react-query';
import { experienceService } from '@/services/experience/experience.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';

export function useDeleteExperience() {
  return useMutation({
    mutationFn: (id: string) => experienceService.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
