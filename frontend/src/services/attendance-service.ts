import type { Attendance, AttendanceDetail } from "@/types";
import apiClient from "./api-client";

export const attendanceService = {
  createSession: (data: Partial<Attendance>) =>
    apiClient.post<Attendance>("/attendance", data),

  getDetails: (attendanceId: number) =>
    apiClient.get<AttendanceDetail[]>(`/attendance/${attendanceId}/details`),

  updateStatus: (detailId: number, status: string) =>
    apiClient.patch(`/attendance-details/${detailId}`, { Status: status }),
};
