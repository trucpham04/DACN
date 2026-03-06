import type { Lecturer, Student } from "@/types";
import apiClient from "./api-client";

export const studentService = {
  getAll: (params?: Record<string, unknown>) =>
    apiClient.get<Student[]>("/students", { params }),

  getById: (id: number) => apiClient.get<Student>(`/students/${id}`),

  updateProfile: (id: number, data: Partial<Student>) =>
    apiClient.put<Student>(`/students/${id}`, data),

  getLecturers: () => apiClient.get<Lecturer[]>("/lecturers"),
};
