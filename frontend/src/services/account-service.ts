import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Account,
  CreateAccountInput,
  GetAccountListParams,
  UpdateAccountInput,
} from "@/types/account";

export function getAccountListUrl(params: GetAccountListParams = {}): string {
  return `/accounts${buildQuery(params)}`;
}

export async function getAccountList(
  params: GetAccountListParams = {},
): Promise<PaginatedData<Account>> {
  return paginatedFetcher<Account>(getAccountListUrl(params));
}

export async function getAccountDetail(accountId: number): Promise<Account> {
  const res = await apiClient.get<Account>(`/accounts/${accountId}`);
  return res.data as Account;
}

export async function getMyAccount(): Promise<Account> {
  const res = await apiClient.get<Account>("/accounts/me");
  return res.data as Account;
}

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const res = await apiClient.post<Account>("/accounts", input);
  return res.data as Account;
}

export async function updateAccount(
  accountId: number,
  input: UpdateAccountInput,
): Promise<Account> {
  const res = await apiClient.put<Account>(`/accounts/${accountId}`, input);
  return res.data as Account;
}

export async function deleteAccount(accountId: number): Promise<null> {
  await apiClient.delete(`/accounts/${accountId}`);
  return null;
}
