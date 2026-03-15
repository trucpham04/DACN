"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getAccountList,
  getAccountListUrl,
  getAccountDetail,
  getMyAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/services/account-service";
import type { PaginatedData } from "@/types/api";
import type {
  Account,
  GetAccountListParams,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/types/account";

export function useAccountList(params: GetAccountListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Account>>(
    getAccountListUrl(params),
    () => getAccountList(params),
  );
}

export function useAccountDetail(accountId?: number) {
  return useFetchWithFetcher<Account>(
    accountId ? `/accounts/${accountId}` : null,
    () => getAccountDetail(accountId!),
    { enabled: !!accountId },
  );
}

export function useMyAccount() {
  return useFetchWithFetcher<Account>("/accounts/me", getMyAccount);
}

export function useCreateAccount() {
  return useMutation<Account, CreateAccountInput>("/accounts", createAccount);
}

export function useUpdateAccount(accountId: number) {
  return useMutation<Account, UpdateAccountInput>(
    `/accounts/${accountId}`,
    (input) => updateAccount(accountId, input),
  );
}

export function useDeleteAccount(accountId: number) {
  return useMutation<null, void>(
    `/accounts/${accountId}/delete`,
    () => deleteAccount(accountId),
  );
}
