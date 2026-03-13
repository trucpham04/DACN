import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Schedule,
  MyScheduleItem,
  GetScheduleListParams,
  GetMyScheduleParams,
  CreateScheduleInput,
  UpdateScheduleInput,
} from "@/types/schedule";

export function getScheduleListUrl(params: GetScheduleListParams = {}): string {
  return `/schedules${buildQuery(params)}`;
}

export function getMyScheduleUrl(params: GetMyScheduleParams = {}): string {
  return `/schedules/my-schedule${buildQuery(params)}`;
}

export function getSchedulesBySectionUrl(sectionId: number): string {
  return `/sections/${sectionId}/schedules`;
}

export async function getScheduleList(
  params: GetScheduleListParams = {},
): Promise<PaginatedData<Schedule>> {
  return paginatedFetcher<Schedule>(getScheduleListUrl(params));
}

export async function getScheduleDetail(scheduleId: number): Promise<Schedule> {
  const res = await apiClient.get<Schedule>(`/schedules/${scheduleId}`);
  return res.data as Schedule;
}

export async function getMySchedule(
  params: GetMyScheduleParams = {},
): Promise<MyScheduleItem[]> {
  const res = await apiClient.get<MyScheduleItem[]>(getMyScheduleUrl(params));
  return (res.data ?? []) as MyScheduleItem[];
}

export async function getSchedulesBySection(sectionId: number): Promise<Schedule[]> {
  const res = await apiClient.get<Schedule[]>(getSchedulesBySectionUrl(sectionId));
  return (res.data ?? []) as Schedule[];
}

export async function createSchedule(input: CreateScheduleInput): Promise<Schedule> {
  const res = await apiClient.post<Schedule>("/schedules", input);
  return res.data as Schedule;
}

export async function updateSchedule(
  scheduleId: number,
  input: UpdateScheduleInput,
): Promise<Schedule> {
  const res = await apiClient.put<Schedule>(`/schedules/${scheduleId}`, input);
  return res.data as Schedule;
}

export async function deleteSchedule(scheduleId: number): Promise<null> {
  await apiClient.delete(`/schedules/${scheduleId}`);
  return null;
}
