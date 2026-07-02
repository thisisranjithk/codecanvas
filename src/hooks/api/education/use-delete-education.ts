import { useMutation, useQueryClient } from '@tanstack/react-query';
import { educationService } from '@/services/education/education.service';
import { queryKeys } from '@/api/query-keys';

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: educationService.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.educations.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    },
  });
}
