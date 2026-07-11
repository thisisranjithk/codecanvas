import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import { useAuth } from '@/hooks/use-auth';

export function useLogout() {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
    },
    onError: () => {
      logout();
    },
  });
}
