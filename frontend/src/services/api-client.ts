import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError, ApiResponse } from "@/types/api";

/**
 * Base API URL - configure based on environment
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Axios instance with interceptors for API calls
 */
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
    // Get token from storage (implement based on your auth strategy)
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
 * Response interceptor - unwrap ApiResponse, handle errors
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // Unwrap the ApiResponse and return just the data
    const apiResponse = response.data;

    if (apiResponse.success) {
      return {
        ...response,
        data: apiResponse.data,
      };
    }

    // If success is false, treat as error
    const error: ApiError = {
      message: apiResponse.message || "An error occurred",
      errorCode: apiResponse.errorCode,
      statusCode: response.status,
    };

    return Promise.reject(error);
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred",
      errorCode: error.response?.data?.errorCode || "NETWORK_ERROR",
      statusCode: error.response?.status || 500,
    };

    // Handle specific status codes
    if (apiError.statusCode === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        // You can dispatch a logout action or redirect here
      }
    }

    return Promise.reject(apiError);
  },
);

/**
 * Generic fetcher function for SWR
 */
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data;
};

export default apiClient;
