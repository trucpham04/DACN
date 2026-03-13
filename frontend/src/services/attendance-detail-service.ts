import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  AttendanceDetail,
  GetAttendanceDetailsParams,
  CreateBulkAttendanceDetailsInput,
  UpdateAttendanceDetailInput,
} from "@/types/attendance";

export function getAttendanceDetailsUrl(
  attendanceId: number,
  params: GetAttendanceDetailsParams = {},
): string {
  return `/attendances/${attendanceId}/details${buildQuery(params)}`;
}

export async function getAttendanceDetails(
  attendanceId: number,
  params: GetAttendanceDetailsParams = {},
): Promise<PaginatedData<AttendanceDetail>> {
  return paginatedFetcher<AttendanceDetail>(getAttendanceDetailsUrl(attendanceId, params));
}

export async function createBulkAttendanceDetails(
  attendanceId: number,
  input: CreateBulkAttendanceDetailsInput,
): Promise<{ created: number; attendanceId: number }> {
  const res = await apiClient.post<{ created: number; attendanceId: number }>(
    `/attendances/${attendanceId}/details`,
    input,
  );
  return res.data as { created: number; attendanceId: number };
}

export async function updateAttendanceDetail(
  attendanceId: number,
  detailId: number,
  input: UpdateAttendanceDetailInput,
): Promise<AttendanceDetail> {
  const res = await apiClient.put<AttendanceDetail>(
    `/attendances/${attendanceId}/details/${detailId}`,
    input,
  );
  return res.data as AttendanceDetail;
}
