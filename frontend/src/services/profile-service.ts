import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Profile,
  ProfileListItem,
  GetProfileListParams,
  UpdateProfileInput,
  AttendanceSummary,
} from "@/types/profile";

export function getProfileListUrl(params: GetProfileListParams = {}): string {
  return `/profiles${buildQuery(params)}`;
}

export function getStudentListUrl(params: GetProfileListParams = {}): string {
  return `/profiles/students${buildQuery(params)}`;
}

export function getLecturerListUrl(params: GetProfileListParams = {}): string {
  return `/profiles/lecturers${buildQuery(params)}`;
}

export async function getProfileList(
  params: GetProfileListParams = {},
): Promise<PaginatedData<ProfileListItem>> {
  return paginatedFetcher<ProfileListItem>(getProfileListUrl(params));
}

export async function getStudentList(
  params: GetProfileListParams = {},
): Promise<PaginatedData<ProfileListItem>> {
  return paginatedFetcher<ProfileListItem>(getStudentListUrl(params));
}

export async function getLecturerList(
  params: GetProfileListParams = {},
): Promise<PaginatedData<ProfileListItem>> {
  return paginatedFetcher<ProfileListItem>(getLecturerListUrl(params));
}

export async function getProfileDetail(profileId: number): Promise<Profile> {
  const res = await apiClient.get<Profile>(`/profiles/${profileId}`);
  return res.data as Profile;
}

export async function getMyProfile(): Promise<Profile> {
  const res = await apiClient.get<Profile>("/profiles/me");
  return res.data as Profile;
}

export async function updateProfile(
  profileId: number,
  input: UpdateProfileInput,
): Promise<Profile> {
  const res = await apiClient.put<Profile>(`/profiles/${profileId}`, input);
  return res.data as Profile;
}

export async function updateMyProfile(input: UpdateProfileInput): Promise<Profile> {
  const res = await apiClient.put<Profile>("/profiles/me", input);
  return res.data as Profile;
}

export async function getAttendanceSummary(
  profileId: number,
  sectionId?: number,
): Promise<AttendanceSummary> {
  const query = sectionId !== undefined ? `?sectionId=${sectionId}` : "";
  const res = await apiClient.get<AttendanceSummary>(
    `/profiles/${profileId}/attendance-summary${query}`,
  );
  return res.data as AttendanceSummary;
}
