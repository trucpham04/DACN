"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getUsageHistoryList,
  getUsageHistoryListUrl,
  getUsageHistoryDetail,
  getUsageHistoriesByRoom,
  getUsageHistoriesByRoomUrl,
  createUsageHistory,
  updateUsageHistory,
  deleteUsageHistory,
  addSectionToUsageHistory,
  removeSectionFromUsageHistory,
} from "@/services/usage-history-service";
import type { PaginatedData } from "@/types/api";
import type {
  UsageHistory,
  UsageHistoryDetail,
  GetUsageHistoryListParams,
  CreateUsageHistoryInput,
  UpdateUsageHistoryInput,
  AddSectionToUsageHistoryInput,
} from "@/types/usage-history";

export function useUsageHistoryList(params: GetUsageHistoryListParams = {}) {
  return useFetchWithFetcher<PaginatedData<UsageHistory>>(
    getUsageHistoryListUrl(params),
    () => getUsageHistoryList(params),
  );
}

export function useUsageHistoryDetail(usageHistoryId?: number) {
  return useFetchWithFetcher<UsageHistoryDetail>(
    usageHistoryId ? `/usage-histories/${usageHistoryId}` : null,
    () => getUsageHistoryDetail(usageHistoryId!),
    { enabled: !!usageHistoryId },
  );
}

export function useUsageHistoriesByRoom(
  roomId?: number,
  params: { page?: number; limit?: number } = {},
) {
  return useFetchWithFetcher<PaginatedData<UsageHistory>>(
    roomId ? getUsageHistoriesByRoomUrl(roomId, params) : null,
    () => getUsageHistoriesByRoom(roomId!, params),
    { enabled: !!roomId },
  );
}

export function useCreateUsageHistory() {
  return useMutation<UsageHistory, CreateUsageHistoryInput>(
    "/usage-histories",
    createUsageHistory,
  );
}

export function useUpdateUsageHistory(usageHistoryId: number) {
  return useMutation<UsageHistory, UpdateUsageHistoryInput>(
    `/usage-histories/${usageHistoryId}`,
    (input) => updateUsageHistory(usageHistoryId, input),
  );
}

export function useDeleteUsageHistory(usageHistoryId: number) {
  return useMutation<null, void>(
    `/usage-histories/${usageHistoryId}/delete`,
    () => deleteUsageHistory(usageHistoryId),
  );
}

export function useAddSectionToUsageHistory(usageHistoryId: number) {
  return useMutation<
    { usageHistoryId: number; sectionId: number },
    AddSectionToUsageHistoryInput
  >(
    `/usage-histories/${usageHistoryId}/sections`,
    (input) => addSectionToUsageHistory(usageHistoryId, input),
  );
}

export function useRemoveSectionFromUsageHistory(
  usageHistoryId: number,
  sectionId: number,
) {
  return useMutation<null, void>(
    `/usage-histories/${usageHistoryId}/sections/${sectionId}/remove`,
    () => removeSectionFromUsageHistory(usageHistoryId, sectionId),
  );
}
