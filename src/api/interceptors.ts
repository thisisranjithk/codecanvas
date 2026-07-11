import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/api/api-error';
import { sessionManager } from '@/lib/session-manager';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiErrorResponse } from '@/types/api';

export function setupInterceptors(client: AxiosInstance): void {
  // ── Request Interceptor ──────────────────────────────────────────────
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = sessionManager.getToken();

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
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        originalRequest.url !== API_ENDPOINTS.AUTH.REFRESH
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await sessionManager.refreshToken();

          // Update authorization header and replay request
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          sessionManager.clearSession();
          return Promise.reject(ApiError.fromAxiosError(refreshError as AxiosError<ApiErrorResponse>));
        }
      }

      return Promise.reject(ApiError.fromAxiosError(error));
    }
  );
}
