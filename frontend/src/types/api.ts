/**
 * Common API Response structure from backend
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

/**
 * API Error structure for error handling
 */
export interface ApiError {
  message: string;
  errorCode?: string;
  statusCode: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
