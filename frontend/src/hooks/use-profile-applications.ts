"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getApplicationList,
  getApplicationListUrl,
  getApplicationDetail,
  getMyApplications,
  getMyApplicationsUrl,
  submitApplication,
  updateApplication,
  reviewApplication,
} from "@/services/profile-application-service";
import type { PaginatedData } from "@/types/api";
import type {
  ProfileApplication,
  GetApplicationListParams,
  GetMyApplicationsParams,
  ReviewApplicationInput,
} from "@/types/profile-application";

export function useApplicationList(params: GetApplicationListParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileApplication>>(
    getApplicationListUrl(params),
    () => getApplicationList(params),
  );
}

export function useApplicationDetail(applicationId?: number) {
  return useFetchWithFetcher<ProfileApplication>(
    applicationId ? `/profile-applications/${applicationId}` : null,
    () => getApplicationDetail(applicationId!),
    { enabled: !!applicationId },
  );
}

export function useMyApplications(params: GetMyApplicationsParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileApplication>>(
    getMyApplicationsUrl(params),
    () => getMyApplications(params),
  );
}

export function useSubmitApplication() {
  return useMutation<ProfileApplication, void>(
    "/profile-applications",
    () => submitApplication(),
  );
}

export function useUpdateApplication(applicationId: number) {
  return useMutation<ProfileApplication, void>(
    `/profile-applications/${applicationId}`,
    () => updateApplication(applicationId),
  );
}

export function useReviewApplication(applicationId: number) {
  return useMutation<ProfileApplication, ReviewApplicationInput>(
    `/profile-applications/${applicationId}/review`,
    (input) => reviewApplication(applicationId, input),
  );
}
