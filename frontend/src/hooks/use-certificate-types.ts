"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getCertificateTypeList,
  getCertificateTypeListUrl,
  getCertificateTypeDetail,
  createCertificateType,
  updateCertificateType,
  deleteCertificateType,
} from "@/services/certificate-type-service";
import type { PaginatedData } from "@/types/api";
import type {
  CertificateType,
  GetCertificateTypeListParams,
  CreateCertificateTypeInput,
  UpdateCertificateTypeInput,
} from "@/types/certificate";

export function useCertificateTypeList(params: GetCertificateTypeListParams = {}) {
  return useFetchWithFetcher<PaginatedData<CertificateType>>(
    getCertificateTypeListUrl(params),
    () => getCertificateTypeList(params),
  );
}

export function useCertificateTypeDetail(typeId?: number) {
  return useFetchWithFetcher<CertificateType>(
    typeId ? `/certificate-types/${typeId}` : null,
    () => getCertificateTypeDetail(typeId!),
    { enabled: !!typeId },
  );
}

export function useCreateCertificateType() {
  return useMutation<CertificateType, CreateCertificateTypeInput>(
    "/certificate-types",
    createCertificateType,
  );
}

export function useUpdateCertificateType(typeId: number) {
  return useMutation<CertificateType, UpdateCertificateTypeInput>(
    `/certificate-types/${typeId}`,
    (input) => updateCertificateType(typeId, input),
  );
}

export function useDeleteCertificateType(typeId: number) {
  return useMutation<null, void>(
    `/certificate-types/${typeId}/delete`,
    () => deleteCertificateType(typeId),
  );
}
