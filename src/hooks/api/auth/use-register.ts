import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth/auth.service';
import type { RegisterRequest } from '@/types';

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
}
