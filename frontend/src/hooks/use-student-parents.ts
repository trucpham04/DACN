"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  assignParentToStudent,
  getStudentParents,
  getStudentParentsUrl,
  unassignParentFromStudent,
} from "@/services/parent-service";
import type { PaginatedData } from "@/types/api";
import type {
  AssignParentToStudentInput,
  AssignParentToStudentResult,
  GetStudentParentsParams,
  StudentParent,
  UnassignParentFromStudentInput,
  UnassignParentFromStudentResult,
} from "@/types/parent-access";

export function useStudentParents(
  studentId?: number,
  params: GetStudentParentsParams = {},
) {
  return useFetchWithFetcher<PaginatedData<StudentParent>>(
    studentId ? getStudentParentsUrl(studentId, params) : null,
    () => getStudentParents(studentId!, params),
    { enabled: !!studentId },
  );
}

export function useAssignParentToStudent() {
  return useMutation<AssignParentToStudentResult, AssignParentToStudentInput>(
    "/parents/assign",
    assignParentToStudent,
  );
}

export function useUnassignParentFromStudent() {
  return useMutation<
    UnassignParentFromStudentResult,
    UnassignParentFromStudentInput
  >("/parents/assign/delete", unassignParentFromStudent);
}
