/**
 * Error payload returned by backend when success = false
 */
export interface ApiErrorPayload {
  code: string;
  message: string;
}

/**
 * Pagination meta returned by backend for list endpoints
 */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

/**
 * Raw API Response structure from backend
 * {
 *   "success": boolean,
 *   "data": object | array | null,
 *   "error": { "code": string, "message": string } | null,
 *   "meta": { "page": number, "limit": number, "total": number }
 * }
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: ApiErrorPayload | null;
  meta?: ApiMeta;
}

/**
 * Normalized error used throughout the frontend after interceptor mapping
 */
export interface ApiError {
  message: string;
  errorCode?: string;
  statusCode: number;
}

/**
 * Paginated list response after unwrapping
 */
export interface PaginatedData<T> {
  items: T[];
  meta: ApiMeta;
}
