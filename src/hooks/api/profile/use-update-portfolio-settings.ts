import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import { toast } from 'sonner';

export function useUpdatePortfolioSettings() {
  return useMutation({
    mutationFn: profileService.updatePortfolioSettings,
    onSuccess: (data) => {
      toast.success(data.message || 'Portfolio settings updated successfully');
      queryClient.invalidateQueries({ queryKey: [...queryKeys.profile.get()] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Failed to save settings'),
  });
}
