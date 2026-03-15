import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Attendance,
  GetAttendanceListParams,
  GetAttendanceBySectionParams,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "@/types/attendance";

export function getAttendanceListUrl(params: GetAttendanceListParams = {}): string {
  return `/attendances${buildQuery(params)}`;
}

export function getAttendancesBySectionUrl(
  sectionId: number,
  params: GetAttendanceBySectionParams = {},
): string {
  return `/sections/${sectionId}/attendances${buildQuery(params)}`;
}

export async function getAttendanceList(
  params: GetAttendanceListParams = {},
): Promise<PaginatedData<Attendance>> {
  return paginatedFetcher<Attendance>(getAttendanceListUrl(params));
}

export async function getAttendanceDetail(attendanceId: number): Promise<Attendance> {
  const res = await apiClient.get<Attendance>(`/attendances/${attendanceId}`);
  return res.data as Attendance;
}

export async function getAttendancesBySection(
  sectionId: number,
  params: GetAttendanceBySectionParams = {},
): Promise<PaginatedData<Attendance>> {
  return paginatedFetcher<Attendance>(getAttendancesBySectionUrl(sectionId, params));
}

export async function createAttendance(input: CreateAttendanceInput): Promise<Attendance> {
  const res = await apiClient.post<Attendance>("/attendances", input);
  return res.data as Attendance;
}

export async function updateAttendance(
  attendanceId: number,
  input: UpdateAttendanceInput,
): Promise<Attendance> {
  const res = await apiClient.put<Attendance>(`/attendances/${attendanceId}`, input);
  return res.data as Attendance;
}

export async function deleteAttendance(attendanceId: number): Promise<null> {
  await apiClient.delete(`/attendances/${attendanceId}`);
  return null;
}
