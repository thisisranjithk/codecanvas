import { useQuery } from '@tanstack/react-query';
import { experienceService } from '@/services/experience/experience.service';
import { queryKeys } from '@/api/query-keys';

export function useExperiences() {
  return useQuery({
    queryKey: queryKeys.experiences.lists(),
    queryFn: () => experienceService.getExperiences(),
  });
}
