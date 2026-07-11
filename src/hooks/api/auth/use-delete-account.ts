import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => authService.deleteAccount(),
  });
}
