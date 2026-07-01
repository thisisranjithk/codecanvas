import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profile/profile.service';
import { queryKeys } from '@/api/query-keys';

export function usePortfolioSettings() {
  return useQuery({
    queryKey: queryKeys.profile.portfolioSettings(),
    queryFn: () => profileService.getPortfolioSettings(),
    retry: 0,
  });
}
