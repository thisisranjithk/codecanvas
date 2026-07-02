import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { queryClient } from '@/api/query-client';
import { toast } from 'sonner';

export function useCreateProfile() {
  return useMutation({
    mutationFn: profileService.createProfile,
    onSuccess: (data) => {
      toast.success(data.message || 'Profile created successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all() });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to create profile'),
  });
}
