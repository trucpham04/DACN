import type { CertificateDetail, ProfileApplication } from "@/types";
import apiClient from "./api-client";

export const approvalService = {
  submitApplication: (data: Partial<ProfileApplication>) =>
    apiClient.post<ProfileApplication>("/applications", data),

  reviewApplication: (
    id: number,
    status: "Approved" | "Rejected",
    notes: string,
  ) =>
    apiClient.patch(`/applications/${id}`, {
      ApplicationStatus: status,
      ReviewNotes: notes,
    }),

  getCertificates: (applicationId: number) =>
    apiClient.get<CertificateDetail[]>(
      `/applications/${applicationId}/certificates`,
    ),
};
