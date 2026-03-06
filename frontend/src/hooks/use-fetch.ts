"use client";

import useSWR, { type SWRConfiguration } from "swr";
import { fetcher } from "@/services/api-client";
import type { ApiError } from "@/types/api";

/**
 * Options for useFetch hook
 */
interface UseFetchOptions<T> extends SWRConfiguration<T, ApiError> {
  /**
   * If false, the request will not be made
   */
  enabled?: boolean;
}

/**
 * Return type for useFetch hook
 */
interface UseFetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isValidating: boolean;
  error: ApiError | undefined;
  mutate: () => Promise<T | undefined>;
}

/**
 * Custom hook that wraps SWR for data fetching
 *
 * @param url - API endpoint to fetch
 * @param options - SWR configuration options
 * @returns Object containing data, loading state, error, and mutate function
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useFetch<User>('/users/1');
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * return <UserCard user={data} />;
 * ```
 */
export function useFetch<T>(
  url: string | null,
  options: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { enabled = true, ...swrOptions } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<T, ApiError>(
    enabled && url ? url : null,
    fetcher<T>,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...swrOptions,
    },
  );

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate: async () => mutate(),
  };
}

/**
 * Hook for fetching data with a custom fetcher function
 * Useful for mock data or non-standard API calls
 */
export function useFetchWithFetcher<T>(
  key: string | null,
  fetcherFn: () => Promise<T>,
  options: UseFetchOptions<T> = {},
): UseFetchResult<T> {
  const { enabled = true, ...swrOptions } = options;

  const { data, error, isLoading, isValidating, mutate } = useSWR<T, ApiError>(
    enabled && key ? key : null,
    fetcherFn,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...swrOptions,
    },
  );

  return {
    data,
    isLoading,
    isValidating,
    error,
    mutate: async () => mutate(),
  };
}

export default useFetch;
