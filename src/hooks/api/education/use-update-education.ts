import { useMutation, useQueryClient } from '@tanstack/react-query';
import { educationService } from '@/services/education/education.service';
import { queryKeys } from '@/api/query-keys';
import type { UpdateEducationRequest } from '@/types/education.types';

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationRequest }) =>
      educationService.updateEducation(id, data),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(queryKeys.educations.detail(variables.id), response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.educations.lists() });
    },
  });
}
