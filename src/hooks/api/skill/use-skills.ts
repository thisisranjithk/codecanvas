import { useQuery } from '@tanstack/react-query';
import { skillService } from '@/services/skill/skill.service';
import { queryKeys } from '@/api/query-keys';

export function useSkills() {
  return useQuery({
    queryKey: queryKeys.skills.lists(),
    queryFn: async () => {
      const response = await skillService.getSkills();
      return response.data;
    },
  });
}
