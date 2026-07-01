import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { authStorage } from '@/lib/auth-storage';
import { ApiError } from '@/api/api-error';
import type { ApiErrorResponse } from '@/types/api';

export function setupInterceptors(client: AxiosInstance): void {
  // ── Request Interceptor ──────────────────────────────────────────────
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStorage.getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => Promise.reject(error)
  );

  // ── Response Interceptor ─────────────────────────────────────────────
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      // TODO: Implement token-refresh logic here when the backend supports it.
      // Example: if 401 && !isRetry → attempt refresh → replay original request.

      return Promise.reject(ApiError.fromAxiosError(error));
    }
  );
}
