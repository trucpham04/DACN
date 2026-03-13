"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getCertificateList,
  getCertificateListUrl,
  getCertificateDetail,
  getCertificatesByApplication,
  getCertificatesByApplicationUrl,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "@/services/certificate-service";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateDetail,
  GetCertificateListParams,
  CreateCertificateInput,
  UpdateCertificateInput,
} from "@/types/certificate";

export function useCertificateList(params: GetCertificateListParams = {}) {
  return useFetchWithFetcher<PaginatedData<CertificateDetail>>(
    getCertificateListUrl(params),
    () => getCertificateList(params),
  );
}

export function useCertificateDetail(certificateId?: number) {
  return useFetchWithFetcher<CertificateDetail>(
    certificateId ? `/certificates/${certificateId}` : null,
    () => getCertificateDetail(certificateId!),
    { enabled: !!certificateId },
  );
}

export function useCertificatesByApplication(applicationId?: number) {
  return useFetchWithFetcher<CertificateDetail[]>(
    applicationId ? getCertificatesByApplicationUrl(applicationId) : null,
    () => getCertificatesByApplication(applicationId!),
    { enabled: !!applicationId },
  );
}

export function useCreateCertificate() {
  return useMutation<CertificateDetail, CreateCertificateInput>(
    "/certificates",
    createCertificate,
  );
}

export function useUpdateCertificate(certificateId: number) {
  return useMutation<CertificateDetail, UpdateCertificateInput>(
    `/certificates/${certificateId}`,
    (input) => updateCertificate(certificateId, input),
  );
}

export function useDeleteCertificate(certificateId: number) {
  return useMutation<null, void>(
    `/certificates/${certificateId}/delete`,
    () => deleteCertificate(certificateId),
  );
}
