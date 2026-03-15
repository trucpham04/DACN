"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getScheduleList,
  getScheduleListUrl,
  getScheduleDetail,
  getMySchedule,
  getMyScheduleUrl,
  getSchedulesBySection,
  getSchedulesBySectionUrl,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "@/services/schedule-service";
import type { PaginatedData } from "@/types/api";
import type {
  Schedule,
  MyScheduleItem,
  GetScheduleListParams,
  GetMyScheduleParams,
  CreateScheduleInput,
  UpdateScheduleInput,
} from "@/types/schedule";

export function useScheduleList(params: GetScheduleListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Schedule>>(
    getScheduleListUrl(params),
    () => getScheduleList(params),
  );
}

export function useScheduleDetail(scheduleId?: number) {
  return useFetchWithFetcher<Schedule>(
    scheduleId ? `/schedules/${scheduleId}` : null,
    () => getScheduleDetail(scheduleId!),
    { enabled: !!scheduleId },
  );
}

export function useMySchedule(params: GetMyScheduleParams = {}) {
  return useFetchWithFetcher<MyScheduleItem[]>(
    getMyScheduleUrl(params),
    () => getMySchedule(params),
  );
}

export function useSchedulesBySection(sectionId?: number) {
  return useFetchWithFetcher<Schedule[]>(
    sectionId ? getSchedulesBySectionUrl(sectionId) : null,
    () => getSchedulesBySection(sectionId!),
    { enabled: !!sectionId },
  );
}

export function useCreateSchedule() {
  return useMutation<Schedule, CreateScheduleInput>("/schedules", createSchedule);
}

export function useUpdateSchedule(scheduleId: number) {
  return useMutation<Schedule, UpdateScheduleInput>(
    `/schedules/${scheduleId}`,
    (input) => updateSchedule(scheduleId, input),
  );
}

export function useDeleteSchedule(scheduleId: number) {
  return useMutation<null, void>(
    `/schedules/${scheduleId}/delete`,
    () => deleteSchedule(scheduleId),
  );
}
