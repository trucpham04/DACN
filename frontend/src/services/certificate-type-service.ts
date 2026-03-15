import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateType,
  GetCertificateTypeListParams,
  CreateCertificateTypeInput,
  UpdateCertificateTypeInput,
} from "@/types/certificate";

export function getCertificateTypeListUrl(params: GetCertificateTypeListParams = {}): string {
  return `/certificate-types${buildQuery(params)}`;
}

export async function getCertificateTypeList(
  params: GetCertificateTypeListParams = {},
): Promise<PaginatedData<CertificateType>> {
  return paginatedFetcher<CertificateType>(getCertificateTypeListUrl(params));
}

export async function getCertificateTypeDetail(typeId: number): Promise<CertificateType> {
  const res = await apiClient.get<CertificateType>(`/certificate-types/${typeId}`);
  return res.data as CertificateType;
}

export async function createCertificateType(
  input: CreateCertificateTypeInput,
): Promise<CertificateType> {
  const res = await apiClient.post<CertificateType>("/certificate-types", input);
  return res.data as CertificateType;
}

export async function updateCertificateType(
  typeId: number,
  input: UpdateCertificateTypeInput,
): Promise<CertificateType> {
  const res = await apiClient.put<CertificateType>(`/certificate-types/${typeId}`, input);
  return res.data as CertificateType;
}

export async function deleteCertificateType(typeId: number): Promise<null> {
  await apiClient.delete(`/certificate-types/${typeId}`);
  return null;
}
