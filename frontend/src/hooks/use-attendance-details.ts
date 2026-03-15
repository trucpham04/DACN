"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getAttendanceDetails,
  getAttendanceDetailsUrl,
  createBulkAttendanceDetails,
  updateAttendanceDetail,
} from "@/services/attendance-detail-service";
import type { PaginatedData } from "@/types/api";
import type {
  AttendanceDetail,
  GetAttendanceDetailsParams,
  CreateBulkAttendanceDetailsInput,
  UpdateAttendanceDetailInput,
} from "@/types/attendance";

export function useAttendanceDetails(
  attendanceId?: number,
  params: GetAttendanceDetailsParams = {},
) {
  return useFetchWithFetcher<PaginatedData<AttendanceDetail>>(
    attendanceId ? getAttendanceDetailsUrl(attendanceId, params) : null,
    () => getAttendanceDetails(attendanceId!, params),
    { enabled: !!attendanceId },
  );
}

export function useCreateBulkAttendanceDetails(attendanceId: number) {
  return useMutation<
    { created: number; attendanceId: number },
    CreateBulkAttendanceDetailsInput
  >(
    `/attendances/${attendanceId}/details`,
    (input) => createBulkAttendanceDetails(attendanceId, input),
  );
}

export function useUpdateAttendanceDetail(attendanceId: number, detailId: number) {
  return useMutation<AttendanceDetail, UpdateAttendanceDetailInput>(
    `/attendances/${attendanceId}/details/${detailId}`,
    (input) => updateAttendanceDetail(attendanceId, detailId, input),
  );
}
