"use client";

import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";
import {
  getStudentCertificates,
  getStudentCertificatesUrl,
  addCertificateToStudent,
  removeCertificateFromStudent,
} from "@/services/student-certificate-service";
import type { PaginatedData } from "@/types/api";
import type {
  StudentCertificate,
  GetStudentCertificatesParams,
  AddCertificateToStudentInput,
} from "@/types/certificate";

export function useStudentCertificates(
  profileId?: number,
  params: GetStudentCertificatesParams = {},
) {
  return useFetchWithFetcher<PaginatedData<StudentCertificate>>(
    profileId ? getStudentCertificatesUrl(profileId, params) : null,
    () => getStudentCertificates(profileId!, params),
    { enabled: !!profileId },
  );
}

export function useAddCertificateToStudent(profileId: number) {
  return useMutation<{ studentId: number; certificateId: number }, AddCertificateToStudentInput>(
    `/profiles/${profileId}/certificates`,
    (input) => addCertificateToStudent(profileId, input),
  );
}

export function useRemoveCertificateFromStudent(
  profileId: number,
  certificateId: number,
) {
  return useMutation<null, void>(
    `/profiles/${profileId}/certificates/${certificateId}/remove`,
    () => removeCertificateFromStudent(profileId, certificateId),
  );
}
