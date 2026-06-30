export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ValidationError[];
  statusCode: number;
  success: false;
}

export interface ValidationError {
  field: string;
  message: string;
}
