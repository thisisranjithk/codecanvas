import { authService } from '@/services/auth/auth.service';
import { queryClient, queryKeys } from '@/api';

let inMemoryToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export
  const sessionManager = {
    getToken(): string | null {
      return inMemoryToken;
    },

    setToken(token: string): void {
      inMemoryToken = token;
    },

    clearToken(): void {
      inMemoryToken = null;
    },

    clearSession(): void {
      inMemoryToken = null;
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
    },

    async refreshToken(): Promise<string> {
      if (!refreshPromise) {
        refreshPromise = authService
          .refresh()
          .then((res) => {
            const token = res.data.accessToken;
            inMemoryToken = token;
            return token;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      return refreshPromise;
    },
  };
