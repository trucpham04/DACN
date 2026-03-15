import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Subject,
  GetSubjectListParams,
  CreateSubjectInput,
  UpdateSubjectInput,
} from "@/types/subject";

export function getSubjectListUrl(params: GetSubjectListParams = {}): string {
  return `/subjects${buildQuery(params)}`;
}

export async function getSubjectList(
  params: GetSubjectListParams = {},
): Promise<PaginatedData<Subject>> {
  return paginatedFetcher<Subject>(getSubjectListUrl(params));
}

export async function getSubjectDetail(subjectId: number): Promise<Subject> {
  const res = await apiClient.get<Subject>(`/subjects/${subjectId}`);
  return res.data as Subject;
}

export async function createSubject(input: CreateSubjectInput): Promise<Subject> {
  const res = await apiClient.post<Subject>("/subjects", input);
  return res.data as Subject;
}

export async function updateSubject(
  subjectId: number,
  input: UpdateSubjectInput,
): Promise<Subject> {
  const res = await apiClient.put<Subject>(`/subjects/${subjectId}`, input);
  return res.data as Subject;
}

export async function deleteSubject(subjectId: number): Promise<null> {
  await apiClient.delete(`/subjects/${subjectId}`);
  return null;
}
