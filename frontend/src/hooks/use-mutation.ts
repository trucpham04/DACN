"use client";

import useSWRMutation from "swr/mutation";
import type { ApiError } from "@/types/api";

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  isLoading: boolean;
  error: ApiError | undefined;
}

/**
 * Hook for performing mutations with SWR
 *
 * @param key - The key to use for caching the mutation
 * @param mutationFn - The function to perform the mutation
 * @returns An object containing the mutate function, loading state, and error
 *
 * @example
 * ```tsx
 * const { mutate, isLoading, error } = useMutation<User, User>('/users', async (user) => {
 *   return await axios.post('/users', user);
 * });
 * ```
 */
export function useMutation<TData, TVariables>(
  key: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, TVariables> {
  const { trigger, isMutating, error } = useSWRMutation<
    TData,
    ApiError,
    string,
    TVariables
  >(key, async (_, { arg }) => mutationFn(arg), {
    throwOnError: false,
  });

  const mutate = async (variables: TVariables) => {
    return (trigger as (arg: TVariables) => Promise<TData | undefined>)(
      variables,
    );
  };

  return {
    mutate,
    isLoading: isMutating,
    error,
  };
}
