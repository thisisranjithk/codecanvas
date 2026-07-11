import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.get(),
    queryFn: () => profileService.getProfile(),
    retry: 0,
  });
}
