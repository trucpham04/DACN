"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getProfileList,
  getProfileListUrl,
  getStudentList,
  getStudentListUrl,
  getLecturerList,
  getLecturerListUrl,
  getProfileDetail,
  getMyProfile,
  updateProfile,
  updateMyProfile,
  getAttendanceSummary,
} from "@/services/profile-service";
import type { PaginatedData } from "@/types/api";
import type {
  Profile,
  ProfileListItem,
  GetProfileListParams,
  UpdateProfileInput,
  AttendanceSummary,
} from "@/types/profile";

export function useProfileList(params: GetProfileListParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileListItem>>(
    getProfileListUrl(params),
    () => getProfileList(params),
  );
}

export function useStudentList(params: GetProfileListParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileListItem>>(
    getStudentListUrl(params),
    () => getStudentList(params),
  );
}

export function useLecturerList(params: GetProfileListParams = {}) {
  return useFetchWithFetcher<PaginatedData<ProfileListItem>>(
    getLecturerListUrl(params),
    () => getLecturerList(params),
  );
}

export function useProfileDetail(profileId?: number) {
  return useFetchWithFetcher<Profile>(
    profileId ? `/profiles/${profileId}` : null,
    () => getProfileDetail(profileId!),
    { enabled: !!profileId },
  );
}

export function useMyProfile() {
  return useFetchWithFetcher<Profile>("/profiles/me", getMyProfile);
}

export function useAttendanceSummary(profileId?: number, sectionId?: number) {
  const query = sectionId !== undefined ? `?sectionId=${sectionId}` : "";
  return useFetchWithFetcher<AttendanceSummary>(
    profileId ? `/profiles/${profileId}/attendance-summary${query}` : null,
    () => getAttendanceSummary(profileId!, sectionId),
    { enabled: !!profileId },
  );
}

export function useUpdateProfile(profileId: number) {
  return useMutation<Profile, UpdateProfileInput>(
    `/profiles/${profileId}`,
    (input) => updateProfile(profileId, input),
  );
}

export function useUpdateMyProfile() {
  return useMutation<Profile, UpdateProfileInput>("/profiles/me", updateMyProfile);
}
