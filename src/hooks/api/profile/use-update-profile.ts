import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all() });
    },
  });
}
