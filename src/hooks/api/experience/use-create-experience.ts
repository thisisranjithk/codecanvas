import { useMutation } from '@tanstack/react-query';
import { experienceService } from '@/services/experience/experience.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { CreateExperienceRequest } from '@/types/experience.types';

export function useCreateExperience() {
  return useMutation({
    mutationFn: (data: CreateExperienceRequest) => experienceService.createExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
