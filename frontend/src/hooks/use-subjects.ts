"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getSubjectList,
  getSubjectListUrl,
  getSubjectDetail,
  createSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subject-service";
import type { PaginatedData } from "@/types/api";
import type {
  Subject,
  GetSubjectListParams,
  CreateSubjectInput,
  UpdateSubjectInput,
} from "@/types/subject";

export function useSubjectList(params: GetSubjectListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Subject>>(
    getSubjectListUrl(params),
    () => getSubjectList(params),
  );
}

export function useSubjectDetail(subjectId?: number) {
  return useFetchWithFetcher<Subject>(
    subjectId ? `/subjects/${subjectId}` : null,
    () => getSubjectDetail(subjectId!),
    { enabled: !!subjectId },
  );
}

export function useCreateSubject() {
  return useMutation<Subject, CreateSubjectInput>("/subjects", createSubject);
}

export function useUpdateSubject(subjectId: number) {
  return useMutation<Subject, UpdateSubjectInput>(
    `/subjects/${subjectId}`,
    (input) => updateSubject(subjectId, input),
  );
}

export function useDeleteSubject(subjectId: number) {
  return useMutation<null, void>(
    `/subjects/${subjectId}/delete`,
    () => deleteSubject(subjectId),
  );
}
