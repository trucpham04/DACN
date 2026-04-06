export interface ParentStudent {
  profileId: number;
  fullName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

export interface ParentStudentSchedule {
  scheduleId: number;
  roomId: number;
  roomName: string;
  subjectId: number;
  subjectName: string;
  sectionId: number;
  sectionName: string;
  dayOfWeek: string;
  startPeriod: number;
  endPeriod: number;
  totalPeriods: number;
  startDate: string;
  endDate: string;
}

export interface ParentAttendanceSession {
  attendanceId: number;
  date: string;
  dayOfWeek: string;
  slot: number;
  roomId: number;
  roomName: string;
  startPeriod: number;
  endPeriod: number;
  status: string;
  note: string;
}

export interface ParentStudentAttendanceBySubject {
  subjectId: number;
  subjectName: string;
  sectionId: number;
  sectionName: string;
  attendanceSessions: ParentAttendanceSession[];
}

export interface GetParentMyStudentsParams {
  page?: number;
  limit?: number;
}

export interface GetParentStudentScheduleParams {
  sectionId?: number;
  roomId?: number;
  dayOfWeek?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetParentStudentAttendanceParams {
  subjectId?: number;
  sectionId?: number;
  startDate?: string;
  endDate?: string;
}

export interface StudentParent {
  profileId: number;
  fullName: string | null;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  avatar: string | null;
}

export interface GetStudentParentsParams {
  page?: number;
  limit?: number;
}

export interface AssignParentToStudentInput {
  studentId: number;
  parentId: number;
}

export interface AssignParentToStudentResult {
  message: string;
  studentId: number;
  parentId: number;
}

export interface UnassignParentFromStudentInput {
  studentId: number;
  parentId: number;
}

export interface UnassignParentFromStudentResult {
  message: string;
}
