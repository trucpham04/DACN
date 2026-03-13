import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  UsageHistory,
  UsageHistoryDetail,
  GetUsageHistoryListParams,
  CreateUsageHistoryInput,
  UpdateUsageHistoryInput,
  AddSectionToUsageHistoryInput,
} from "@/types/usage-history";

export function getUsageHistoryListUrl(params: GetUsageHistoryListParams = {}): string {
  return `/usage-histories${buildQuery(params)}`;
}

export function getUsageHistoriesByRoomUrl(
  roomId: number,
  params: { page?: number; limit?: number } = {},
): string {
  return `/rooms/${roomId}/usage-histories${buildQuery(params)}`;
}

export async function getUsageHistoryList(
  params: GetUsageHistoryListParams = {},
): Promise<PaginatedData<UsageHistory>> {
  return paginatedFetcher<UsageHistory>(getUsageHistoryListUrl(params));
}

export async function getUsageHistoryDetail(
  usageHistoryId: number,
): Promise<UsageHistoryDetail> {
  const res = await apiClient.get<UsageHistoryDetail>(`/usage-histories/${usageHistoryId}`);
  return res.data as UsageHistoryDetail;
}

export async function getUsageHistoriesByRoom(
  roomId: number,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<UsageHistory>> {
  return paginatedFetcher<UsageHistory>(getUsageHistoriesByRoomUrl(roomId, params));
}

export async function createUsageHistory(
  input: CreateUsageHistoryInput,
): Promise<UsageHistory> {
  const res = await apiClient.post<UsageHistory>("/usage-histories", input);
  return res.data as UsageHistory;
}

export async function updateUsageHistory(
  usageHistoryId: number,
  input: UpdateUsageHistoryInput,
): Promise<UsageHistory> {
  const res = await apiClient.put<UsageHistory>(
    `/usage-histories/${usageHistoryId}`,
    input,
  );
  return res.data as UsageHistory;
}

export async function deleteUsageHistory(usageHistoryId: number): Promise<null> {
  await apiClient.delete(`/usage-histories/${usageHistoryId}`);
  return null;
}

export async function addSectionToUsageHistory(
  usageHistoryId: number,
  input: AddSectionToUsageHistoryInput,
): Promise<{ usageHistoryId: number; sectionId: number }> {
  const res = await apiClient.post<{ usageHistoryId: number; sectionId: number }>(
    `/usage-histories/${usageHistoryId}/sections`,
    input,
  );
  return res.data as { usageHistoryId: number; sectionId: number };
}

export async function removeSectionFromUsageHistory(
  usageHistoryId: number,
  sectionId: number,
): Promise<null> {
  await apiClient.delete(`/usage-histories/${usageHistoryId}/sections/${sectionId}`);
  return null;
}
