"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getSectionList,
  getSectionListUrl,
  getMySections,
  getMySectionsUrl,
  getSectionDetail,
  getSectionStudents,
  getSectionStudentsUrl,
  createSection,
  updateSection,
  updateSectionStatus,
  updateSectionVisibility,
  deleteSection,
} from "@/services/section-service";
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

export function useSectionList(params: GetSectionListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Section>>(
    getSectionListUrl(params),
    () => getSectionList(params),
  );
}

export function useMySections(params: GetMySectionsParams = {}) {
  return useFetchWithFetcher<PaginatedData<Section>>(
    getMySectionsUrl(params),
    () => getMySections(params),
  );
}

export function useSectionDetail(sectionId?: number) {
  return useFetchWithFetcher<Section>(
    sectionId ? `/sections/${sectionId}` : null,
    () => getSectionDetail(sectionId!),
    { enabled: !!sectionId },
  );
}

export function useSectionStudents(
  sectionId?: number,
  params: { page?: number; limit?: number } = {},
) {
  return useFetchWithFetcher<PaginatedData<SectionStudent>>(
    sectionId ? getSectionStudentsUrl(sectionId, params) : null,
    () => getSectionStudents(sectionId!, params),
    { enabled: !!sectionId },
  );
}

export function useCreateSection() {
  return useMutation<Section, CreateSectionInput>("/sections", createSection);
}

export function useUpdateSection(sectionId: number) {
  return useMutation<Section, UpdateSectionInput>(
    `/sections/${sectionId}`,
    (input) => updateSection(sectionId, input),
  );
}

export function useUpdateSectionStatus(sectionId: number) {
  return useMutation<{ sectionId: number; status: number }, UpdateSectionStatusInput>(
    `/sections/${sectionId}/status`,
    (input) => updateSectionStatus(sectionId, input),
  );
}

export function useUpdateSectionVisibility(sectionId: number) {
  return useMutation<
    { sectionId: number; visibility: number },
    UpdateSectionVisibilityInput
  >(
    `/sections/${sectionId}/visibility`,
    (input) => updateSectionVisibility(sectionId, input),
  );
}

export function useDeleteSection(sectionId: number) {
  return useMutation<null, void>(
    `/sections/${sectionId}/delete`,
    () => deleteSection(sectionId),
  );
}
