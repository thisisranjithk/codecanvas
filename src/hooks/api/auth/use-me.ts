import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { authService } from '@/services/auth/auth.service';

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    ...options,
  });
}
