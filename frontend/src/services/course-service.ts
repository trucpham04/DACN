import type { Registration, Section, Subject } from "@/types";
import apiClient from "./api-client";

export const courseService = {
  getSubjects: () => apiClient.get<Subject[]>("/subjects"),

  getSections: (semester?: number, year?: string) =>
    apiClient.get<Section[]>("/sections", { params: { semester, year } }),

  register: (sectionId: number, studentId: number) =>
    apiClient.post<Registration>("/registrations", {
      SectionID: sectionId,
      StudentID: studentId,
    }),

  unregister: (sectionId: number, studentId: number) =>
    apiClient.delete("/registrations", {
      data: { SectionID: sectionId, StudentID: studentId },
    }),
};
