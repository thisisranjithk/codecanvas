import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';
import { toast } from 'sonner';

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.createProfile,
    onSuccess: () => {
      toast.success('Profile created successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all() });
    },
  });
}
