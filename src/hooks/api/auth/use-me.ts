import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { authService } from '@/services/auth/auth.service';
import { authStorage } from '@/lib/auth-storage';

export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled: !!authStorage.getToken(),
  });
}
