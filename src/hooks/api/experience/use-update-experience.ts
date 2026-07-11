import { useMutation } from '@tanstack/react-query';
import { experienceService } from '@/services/experience/experience.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { UpdateExperienceRequest } from '@/types/experience.types';

export function useUpdateExperience() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperienceRequest }) =>
      experienceService.updateExperience(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences.lists() });
      queryClient.setQueryData(queryKeys.experiences.detail(id), response.data);
    },
  });
}
