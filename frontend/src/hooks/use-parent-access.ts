"use client";

import { useFetchWithFetcher } from "./use-fetch";
import {
  getParentMyStudents,
  getParentMyStudentsUrl,
  getParentStudentAttendance,
  getParentStudentAttendanceUrl,
  getParentStudentSchedule,
  getParentStudentScheduleUrl,
} from "@/services/parent-service";
import type { PaginatedData } from "@/types/api";
import type {
  GetParentMyStudentsParams,
  GetParentStudentAttendanceParams,
  GetParentStudentScheduleParams,
  ParentStudent,
  ParentStudentAttendanceBySubject,
  ParentStudentSchedule,
} from "@/types/parent-access";

export function useParentMyStudents(params: GetParentMyStudentsParams = {}) {
  return useFetchWithFetcher<PaginatedData<ParentStudent>>(
    getParentMyStudentsUrl(params),
    () => getParentMyStudents(params),
  );
}

export function useParentStudentSchedule(
  studentId?: number,
  params: GetParentStudentScheduleParams = {},
) {
  return useFetchWithFetcher<ParentStudentSchedule[]>(
    studentId ? getParentStudentScheduleUrl(studentId, params) : null,
    () => getParentStudentSchedule(studentId!, params),
    { enabled: !!studentId },
  );
}

export function useParentStudentAttendance(
  studentId?: number,
  params: GetParentStudentAttendanceParams = {},
) {
  return useFetchWithFetcher<ParentStudentAttendanceBySubject[]>(
    studentId ? getParentStudentAttendanceUrl(studentId, params) : null,
    () => getParentStudentAttendance(studentId!, params),
    { enabled: !!studentId },
  );
}
