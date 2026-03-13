"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getAttendanceList,
  getAttendanceListUrl,
  getAttendanceDetail,
  getAttendancesBySection,
  getAttendancesBySectionUrl,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "@/services/attendance-service";
import type { PaginatedData } from "@/types/api";
import type {
  Attendance,
  GetAttendanceListParams,
  GetAttendanceBySectionParams,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "@/types/attendance";

export function useAttendanceList(params: GetAttendanceListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Attendance>>(
    getAttendanceListUrl(params),
    () => getAttendanceList(params),
  );
}

export function useAttendanceDetail(attendanceId?: number) {
  return useFetchWithFetcher<Attendance>(
    attendanceId ? `/attendances/${attendanceId}` : null,
    () => getAttendanceDetail(attendanceId!),
    { enabled: !!attendanceId },
  );
}

export function useAttendancesBySection(
  sectionId?: number,
  params: GetAttendanceBySectionParams = {},
) {
  return useFetchWithFetcher<PaginatedData<Attendance>>(
    sectionId ? getAttendancesBySectionUrl(sectionId, params) : null,
    () => getAttendancesBySection(sectionId!, params),
    { enabled: !!sectionId },
  );
}

export function useCreateAttendance() {
  return useMutation<Attendance, CreateAttendanceInput>("/attendances", createAttendance);
}

export function useUpdateAttendance(attendanceId: number) {
  return useMutation<Attendance, UpdateAttendanceInput>(
    `/attendances/${attendanceId}`,
    (input) => updateAttendance(attendanceId, input),
  );
}

export function useDeleteAttendance(attendanceId: number) {
  return useMutation<null, void>(
    `/attendances/${attendanceId}/delete`,
    () => deleteAttendance(attendanceId),
  );
}
