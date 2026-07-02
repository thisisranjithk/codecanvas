import { useMutation } from '@tanstack/react-query';
import { skillService } from '@/services/skill/skill.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';

export function useDeleteSkill() {
  return useMutation({
    mutationFn: (id: string) => skillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}

