import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  ProfileApplication,
  GetApplicationListParams,
  GetMyApplicationsParams,
  ReviewApplicationInput,
} from "@/types/profile-application";

export function getApplicationListUrl(params: GetApplicationListParams = {}): string {
  return `/profile-applications${buildQuery(params)}`;
}

export function getMyApplicationsUrl(params: GetMyApplicationsParams = {}): string {
  return `/profile-applications/my-applications${buildQuery(params)}`;
}

export async function getApplicationList(
  params: GetApplicationListParams = {},
): Promise<PaginatedData<ProfileApplication>> {
  return paginatedFetcher<ProfileApplication>(getApplicationListUrl(params));
}

export async function getApplicationDetail(
  applicationId: number,
): Promise<ProfileApplication> {
  const res = await apiClient.get<ProfileApplication>(
    `/profile-applications/${applicationId}`,
  );
  return res.data as ProfileApplication;
}

export async function getMyApplications(
  params: GetMyApplicationsParams = {},
): Promise<PaginatedData<ProfileApplication>> {
  return paginatedFetcher<ProfileApplication>(getMyApplicationsUrl(params));
}

export async function submitApplication(): Promise<ProfileApplication> {
  const res = await apiClient.post<ProfileApplication>("/profile-applications", {});
  return res.data as ProfileApplication;
}

export async function updateApplication(applicationId: number): Promise<ProfileApplication> {
  const res = await apiClient.put<ProfileApplication>(
    `/profile-applications/${applicationId}`,
    {},
  );
  return res.data as ProfileApplication;
}

export async function reviewApplication(
  applicationId: number,
  input: ReviewApplicationInput,
): Promise<ProfileApplication> {
  const res = await apiClient.patch<ProfileApplication>(
    `/profile-applications/${applicationId}/review`,
    input,
  );
  return res.data as ProfileApplication;
}
