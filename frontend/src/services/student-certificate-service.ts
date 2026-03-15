import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  StudentCertificate,
  GetStudentCertificatesParams,
  AddCertificateToStudentInput,
} from "@/types/certificate";

export function getStudentCertificatesUrl(
  profileId: number,
  params: GetStudentCertificatesParams = {},
): string {
  return `/profiles/${profileId}/certificates${buildQuery(params)}`;
}

export async function getStudentCertificates(
  profileId: number,
  params: GetStudentCertificatesParams = {},
): Promise<PaginatedData<StudentCertificate>> {
  return paginatedFetcher<StudentCertificate>(
    getStudentCertificatesUrl(profileId, params),
  );
}

export async function addCertificateToStudent(
  profileId: number,
  input: AddCertificateToStudentInput,
): Promise<{ studentId: number; certificateId: number }> {
  const res = await apiClient.post<{ studentId: number; certificateId: number }>(
    `/profiles/${profileId}/certificates`,
    input,
  );
  return res.data as { studentId: number; certificateId: number };
}

export async function removeCertificateFromStudent(
  profileId: number,
  certificateId: number,
): Promise<null> {
  await apiClient.delete(`/profiles/${profileId}/certificates/${certificateId}`);
  return null;
}
