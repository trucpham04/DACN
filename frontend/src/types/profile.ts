import type { Role } from "./account";

export interface Profile {
  profileId: number;
  accountId: number;
  role: Role;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
  citizenId: string | null;
  hometown: string | null;
  status: string | null;
}

export interface ProfileListItem {
  profileId: number;
  accountId: number;
  role: Role;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  status: string | null;
}

export interface GetProfileListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  avatar?: string;
  citizenId?: string;
  hometown?: string;
  status?: string;
}

export interface AttendanceSummary {
  profileId: number;
  studentName: string;
  sectionId: number | null;
  subjectName: string | null;
  totalSessions: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}
