import { useQuery } from '@tanstack/react-query';
import { skillService } from '@/services/skill/skill.service';
import { queryKeys } from '@/api/query-keys';

export function useSkill(id: string) {
  return useQuery({
    queryKey: queryKeys.skills.detail(id),
    queryFn: async () => {
      const response = await skillService.getSkill(id);
      return response.data;
    },
    enabled: !!id,
  });
}
