import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError, ApiMeta, ApiResponse, PaginatedData } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - attach auth token if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - unwrap ApiResponse, expose meta, map errors
 *
 * On success:  response.data  = T (unwrapped)
 *              response.meta  = ApiMeta | undefined
 * On failure:  rejects with ApiError (message, errorCode, statusCode)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;

    if (body.success) {
      return {
        ...response,
        data: body.data,
        meta: body.meta,
      };
    }

    // Backend returned success: false with an error payload
    const error: ApiError = {
      message: body.error?.message ?? "An error occurred",
      errorCode: body.error?.code,
      statusCode: response.status,
    };

    return Promise.reject(error);
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const body = error.response?.data;

    // Attempt to read the nested error object from backend contract
    const backendError = body && typeof body === "object" ? body.error : null;

    const apiError: ApiError = {
      message: backendError?.message ?? error.message ?? "Network error occurred",
      errorCode: backendError?.code ?? "NETWORK_ERROR",
      statusCode: error.response?.status ?? 500,
    };

    if (apiError.statusCode === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(apiError);
  },
);

/**
 * Generic fetcher for SWR / simple GET calls.
 * Returns the unwrapped data (T), not the full ApiResponse.
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data as T;
};

/**
 * Helper for paginated GET calls.
 * Returns { items: T[], meta: ApiMeta }.
 */
export const paginatedFetcher = async <T>(
  url: string,
): Promise<PaginatedData<T>> => {
  const response = await apiClient.get<T[]>(url);
  const axiosResponse = response as AxiosResponse<T[]> & { meta?: ApiMeta };
  return {
    items: response.data as T[],
    meta: axiosResponse.meta ?? { page: 1, limit: 10, total: 0 },
  };
};

export default apiClient;
