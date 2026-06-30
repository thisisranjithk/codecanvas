import type { AxiosError } from 'axios';
import type { ApiErrorResponse, ValidationError } from '@/types/api';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: ValidationError[];
  public readonly originalError: unknown;

  constructor(
    message: string,
    statusCode: number,
    errors: ValidationError[] = [],
    originalError?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.originalError = originalError;
  }

  static fromAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
    const response = error.response;

    if (response?.data) {
      return new ApiError(
        response.data.message || 'An unexpected error occurred',
        response.status,
        response.data.errors ?? [],
        error,
      );
    }

    if (error.code === 'ECONNABORTED') {
      return new ApiError('Request timed out. Please try again.', 408, [], error);
    }

    return new ApiError(
      error.message || 'Network error. Please check your connection.',
      0,
      [],
      error,
    );
  }
}
