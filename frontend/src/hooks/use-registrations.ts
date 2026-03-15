"use client";

import {
  cancelRegistration,
  getMyRegistrations,
  getMyRegistrationsUrl,
  getRegistrationList,
  getRegistrationListUrl,
  getRegistrationsBySection,
  getRegistrationsBySectionUrl,
  registerSection,
} from "@/services/registration-service";
import type { PaginatedData } from "@/types/api";
import type {
  GetMyRegistrationsParams,
  GetRegistrationListParams,
  MyRegistration,
  RegisterSectionInput,
  Registration,
  RegistrationBySection,
} from "@/types/registration";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useRegistrationList(params: GetRegistrationListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Registration>>(
    getRegistrationListUrl(params),
    () => getRegistrationList(params),
  );
}

export function useMyRegistrations(params: GetMyRegistrationsParams = {}) {
  return useFetchWithFetcher<PaginatedData<MyRegistration>>(
    getMyRegistrationsUrl(params),
    () => getMyRegistrations(params),
  );
}

export function useRegistrationsBySection(
  sectionId?: number,
  params: { page?: number; limit?: number } = {},
) {
  return useFetchWithFetcher<PaginatedData<RegistrationBySection>>(
    sectionId ? getRegistrationsBySectionUrl(sectionId, params) : null,
    () => getRegistrationsBySection(sectionId!, params),
    { enabled: !!sectionId },
  );
}

export function useRegisterSection() {
  return useMutation<
    { sectionId: number; studentProfileId: number },
    RegisterSectionInput
  >("/registrations", registerSection);
}

export function useCancelRegistration(sectionId: number) {
  return useMutation<null, void>(`/registrations/${sectionId}/cancel`, () =>
    cancelRegistration(sectionId),
  );
}
