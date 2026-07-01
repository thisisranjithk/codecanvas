import { useMutation } from '@tanstack/react-query';
import { skillService } from '@/services/skill/skill.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import type { UpdateSkillRequest } from '@/types/skill.types';

export function useUpdateSkill() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSkillRequest }) =>
      skillService.updateSkill(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.detail(variables.id) });
    },
  });
}
