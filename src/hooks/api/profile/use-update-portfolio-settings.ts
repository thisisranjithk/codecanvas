import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { toast } from 'sonner';

export function useUpdatePortfolioSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updatePortfolioSettings,
    onSuccess: () => {
      toast.success('Portfolio settings updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
    },
  });
}
