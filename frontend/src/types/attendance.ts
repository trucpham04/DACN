export interface Attendance {
  attendanceId: number;
  sectionId: number;
  subjectName?: string;
  attendanceDate: string;
  slot: number;
  note: string | null;
  createdAt: string;
}

export interface AttendanceDetail {
  attendanceDetailId: number;
  studentProfileId: number;
  studentName: string;
  status: string | null;
  note: string | null;
}

export type AttendanceStatus = "present" | "absent" | "late";

export interface BulkAttendanceDetailItem {
  studentProfileId: number;
  status: AttendanceStatus;
  note?: string;
}

export interface GetAttendanceListParams {
  page?: number;
  limit?: number;
  sectionId?: number;
}

export interface GetAttendanceBySectionParams {
  page?: number;
  limit?: number;
}

export interface GetAttendanceDetailsParams {
  page?: number;
  limit?: number;
}

export interface CreateAttendanceInput {
  sectionId: number;
  attendanceDate: string;
  slot: number;
  note?: string;
}

export interface UpdateAttendanceInput {
  attendanceDate?: string;
  slot?: number;
  note?: string;
}

export interface CreateBulkAttendanceDetailsInput {
  details: BulkAttendanceDetailItem[];
}

export interface UpdateAttendanceDetailInput {
  status?: AttendanceStatus;
  note?: string;
}
