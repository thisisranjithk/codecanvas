import { useQuery } from '@tanstack/react-query';
import { experienceService } from '@/services/experience/experience.service';
import { queryKeys } from '@/api/query-keys';

export function useExperience(id: string) {
  return useQuery({
    queryKey: queryKeys.experiences.detail(id),
    queryFn: () => experienceService.getExperience(id),
    enabled: !!id,
  });
}
