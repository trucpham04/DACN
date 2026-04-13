import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateDetail,
  GetCertificateListParams,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "@/types/certificate";

type BackendCertificateDetail = {
  CertificateID?: number;
  ApplicationID?: number;
  CertificateTypeID?: number;
  Score?: number | null;
  IssueDate?: string | null;
  ExpiryDate?: string | null;
  EvidenceURL?: string | null;
  Metadata?: Record<string, unknown> | null;
  certificateType?: {
    TypeName?: string;
  } | null;
  TypeName?: string;
  // Some endpoints may already return camelCase
  certificateId?: number;
  applicationId?: number;
  certificateTypeId?: number;
  score?: number | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  evidenceURL?: string | null;
  metadata?: Record<string, unknown> | null;
  typeName?: string;
};

function mapCertificateFromBackend(
  input: BackendCertificateDetail,
): CertificateDetail {
  return {
    certificateId: input.certificateId ?? input.CertificateID ?? 0,
    applicationId: input.applicationId ?? input.ApplicationID ?? 0,
    certificateTypeId: input.certificateTypeId ?? input.CertificateTypeID ?? 0,
    typeName:
      input.typeName ??
      input.TypeName ??
      input.certificateType?.TypeName ??
      undefined,
    score: input.score ?? input.Score ?? null,
    issueDate: input.issueDate ?? input.IssueDate ?? null,
    expiryDate: input.expiryDate ?? input.ExpiryDate ?? null,
    evidenceURL: input.evidenceURL ?? input.EvidenceURL ?? null,
    metadata: input.metadata ?? input.Metadata ?? null,
  };
}

export function getCertificateListUrl(params: GetCertificateListParams = {}): string {
  return `/certificates${buildQuery(params)}`;
}

export function getCertificatesByApplicationUrl(applicationId: number): string {
  return `/profile-applications/${applicationId}/certificates`;
}

export async function getCertificateList(
  params: GetCertificateListParams = {},
): Promise<PaginatedData<CertificateDetail>> {
  const paged = await paginatedFetcher<BackendCertificateDetail>(
    getCertificateListUrl(params),
  );
  return {
    ...paged,
    items: (paged.items ?? []).map(mapCertificateFromBackend),
  };
}

export async function getCertificateDetail(certificateId: number): Promise<CertificateDetail> {
  const res = await apiClient.get<BackendCertificateDetail>(
    `/certificates/${certificateId}`,
  );
  return mapCertificateFromBackend(res.data as BackendCertificateDetail);
}

export async function getCertificatesByApplication(
  applicationId: number,
): Promise<CertificateDetail[]> {
  const res = await apiClient.get<BackendCertificateDetail[]>(
    getCertificatesByApplicationUrl(applicationId),
  );
  return (res.data ?? []).map(mapCertificateFromBackend);
}

export async function createCertificate(
  input: CreateCertificateInput,
): Promise<CertificateDetail> {
  const res = await apiClient.post<BackendCertificateDetail>(
    "/certificates",
    input,
  );
  return mapCertificateFromBackend(res.data as BackendCertificateDetail);
}

export async function updateCertificate(
  certificateId: number,
  input: UpdateCertificateInput,
): Promise<CertificateDetail> {
  const res = await apiClient.put<BackendCertificateDetail>(
    `/certificates/${certificateId}`,
    input,
  );
  return mapCertificateFromBackend(res.data as BackendCertificateDetail);
}

export async function deleteCertificate(certificateId: number): Promise<null> {
  await apiClient.delete(`/certificates/${certificateId}`);
  return null;
}
