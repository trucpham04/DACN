import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateDetail,
  GetCertificateListParams,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "@/types/certificate";

export function getCertificateListUrl(params: GetCertificateListParams = {}): string {
  return `/certificates${buildQuery(params)}`;
}

export function getCertificatesByApplicationUrl(applicationId: number): string {
  return `/profile-applications/${applicationId}/certificates`;
}

export async function getCertificateList(
  params: GetCertificateListParams = {},
): Promise<PaginatedData<CertificateDetail>> {
  return paginatedFetcher<CertificateDetail>(getCertificateListUrl(params));
}

export async function getCertificateDetail(certificateId: number): Promise<CertificateDetail> {
  const res = await apiClient.get<CertificateDetail>(`/certificates/${certificateId}`);
  return res.data as CertificateDetail;
}

export async function getCertificatesByApplication(
  applicationId: number,
): Promise<CertificateDetail[]> {
  const res = await apiClient.get<CertificateDetail[]>(
    getCertificatesByApplicationUrl(applicationId),
  );
  return (res.data ?? []) as CertificateDetail[];
}

export async function createCertificate(
  input: CreateCertificateInput,
): Promise<CertificateDetail> {
  const res = await apiClient.post<CertificateDetail>("/certificates", input);
  return res.data as CertificateDetail;
}

export async function updateCertificate(
  certificateId: number,
  input: UpdateCertificateInput,
): Promise<CertificateDetail> {
  const res = await apiClient.put<CertificateDetail>(
    `/certificates/${certificateId}`,
    input,
  );
  return res.data as CertificateDetail;
}

export async function deleteCertificate(certificateId: number): Promise<null> {
  await apiClient.delete(`/certificates/${certificateId}`);
  return null;
}
