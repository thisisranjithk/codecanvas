import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import { toast } from 'sonner';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      toast.success(data.message || 'Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all() });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to update profile'),
  });
}
