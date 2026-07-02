import { useMutation } from '@tanstack/react-query';
import { skillService } from '@/services/skill/skill.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { CreateSkillRequest } from '@/types/skill.types';

export function useCreateSkill() {
  return useMutation({
    mutationFn: (data: CreateSkillRequest) => skillService.createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all() });
    },
  });
}

