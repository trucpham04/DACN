import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  AssignParentToStudentInput,
  AssignParentToStudentResult,
  GetParentMyStudentsParams,
  GetParentStudentAttendanceParams,
  GetParentStudentScheduleParams,
  GetStudentParentsParams,
  ParentStudent,
  ParentStudentAttendanceBySubject,
  ParentStudentSchedule,
  StudentParent,
  UnassignParentFromStudentInput,
  UnassignParentFromStudentResult,
} from "@/types/parent-access";

interface ParentStudentRaw {
  profileID: number;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
}

interface StudentParentRaw {
  profileID: number;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
}

export function getParentMyStudentsUrl(
  params: GetParentMyStudentsParams = {},
): string {
  return `/parents/my-students${buildQuery(params)}`;
}

export function getParentStudentScheduleUrl(
  studentId: number,
  params: GetParentStudentScheduleParams = {},
): string {
  return `/parents/students/${studentId}/schedule${buildQuery(params)}`;
}

export function getParentStudentAttendanceUrl(
  studentId: number,
  params: GetParentStudentAttendanceParams = {},
): string {
  return `/parents/students/${studentId}/attendance${buildQuery(params)}`;
}

export function getStudentParentsUrl(
  studentId: number,
  params: GetStudentParentsParams = {},
): string {
  return `/students/${studentId}/parents${buildQuery(params)}`;
}

export async function getParentMyStudents(
  params: GetParentMyStudentsParams = {},
): Promise<PaginatedData<ParentStudent>> {
  const res = await paginatedFetcher<ParentStudentRaw>(
    getParentMyStudentsUrl(params),
  );

  return {
    items: res.items.map((item) => ({
      profileId: item.profileID,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      dateOfBirth: item.dateOfBirth,
      gender: item.gender,
      avatar: item.avatar,
    })),
    meta: res.meta,
  };
}

export async function getParentStudentSchedule(
  studentId: number,
  params: GetParentStudentScheduleParams = {},
): Promise<ParentStudentSchedule[]> {
  const res = await apiClient.get<ParentStudentSchedule[]>(
    getParentStudentScheduleUrl(studentId, params),
  );
  return (res.data ?? []) as ParentStudentSchedule[];
}

export async function getParentStudentAttendance(
  studentId: number,
  params: GetParentStudentAttendanceParams = {},
): Promise<ParentStudentAttendanceBySubject[]> {
  const res = await apiClient.get<ParentStudentAttendanceBySubject[]>(
    getParentStudentAttendanceUrl(studentId, params),
  );
  return (res.data ?? []) as ParentStudentAttendanceBySubject[];
}

export async function getStudentParents(
  studentId: number,
  params: GetStudentParentsParams = {},
): Promise<PaginatedData<StudentParent>> {
  const res = await paginatedFetcher<StudentParentRaw>(
    getStudentParentsUrl(studentId, params),
  );

  return {
    items: res.items.map((item) => ({
      profileId: item.profileID,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      email: item.email,
      dateOfBirth: item.dateOfBirth,
      gender: item.gender,
      avatar: item.avatar,
    })),
    meta: res.meta,
  };
}

export async function assignParentToStudent(
  input: AssignParentToStudentInput,
): Promise<AssignParentToStudentResult> {
  const res = await apiClient.post<AssignParentToStudentResult>(
    "/parents/assign",
    input,
  );
  return res.data as AssignParentToStudentResult;
}

export async function unassignParentFromStudent(
  input: UnassignParentFromStudentInput,
): Promise<UnassignParentFromStudentResult> {
  const res = await apiClient.delete<UnassignParentFromStudentResult>(
    `/parents/assign${buildQuery(input)}`,
  );
  return res.data as UnassignParentFromStudentResult;
}
