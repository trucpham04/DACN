import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Section,
  SectionStudent,
  GetSectionListParams,
  GetMySectionsParams,
  CreateSectionInput,
  UpdateSectionInput,
  UpdateSectionStatusInput,
  UpdateSectionVisibilityInput,
} from "@/types/section";

export function getSectionListUrl(params: GetSectionListParams = {}): string {
  return `/sections${buildQuery(params)}`;
}

export function getMySectionsUrl(params: GetMySectionsParams = {}): string {
  return `/sections/my-sections${buildQuery(params)}`;
}

export function getSectionStudentsUrl(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): string {
  return `/sections/${sectionId}/students${buildQuery(params)}`;
}

export async function getSectionList(
  params: GetSectionListParams = {},
): Promise<PaginatedData<Section>> {
  return paginatedFetcher<Section>(getSectionListUrl(params));
}

export async function getMySections(
  params: GetMySectionsParams = {},
): Promise<PaginatedData<Section>> {
  return paginatedFetcher<Section>(getMySectionsUrl(params));
}

export async function getSectionDetail(sectionId: number): Promise<Section> {
  const res = await apiClient.get<Section>(`/sections/${sectionId}`);
  return res.data as Section;
}

export async function getSectionStudents(
  sectionId: number,
  params: { page?: number; limit?: number } = {},
): Promise<PaginatedData<SectionStudent>> {
  return paginatedFetcher<SectionStudent>(getSectionStudentsUrl(sectionId, params));
}

export async function createSection(input: CreateSectionInput): Promise<Section> {
  const res = await apiClient.post<Section>("/sections", input);
  return res.data as Section;
}

export async function updateSection(
  sectionId: number,
  input: UpdateSectionInput,
): Promise<Section> {
  const res = await apiClient.put<Section>(`/sections/${sectionId}`, input);
  return res.data as Section;
}

export async function updateSectionStatus(
  sectionId: number,
  input: UpdateSectionStatusInput,
): Promise<{ sectionId: number; status: number }> {
  const res = await apiClient.patch<{ sectionId: number; status: number }>(
    `/sections/${sectionId}/status`,
    input,
  );
  return res.data as { sectionId: number; status: number };
}

export async function updateSectionVisibility(
  sectionId: number,
  input: UpdateSectionVisibilityInput,
): Promise<{ sectionId: number; visibility: number }> {
  const res = await apiClient.patch<{ sectionId: number; visibility: number }>(
    `/sections/${sectionId}/visibility`,
    input,
  );
  return res.data as { sectionId: number; visibility: number };
}

export async function deleteSection(sectionId: number): Promise<null> {
  await apiClient.delete(`/sections/${sectionId}`);
  return null;
}
