export interface CertificateType {
  certificateTypeId: number;
  typeName: string;
  description: string | null;
}

export interface CertificateDetail {
  certificateId: number;
  applicationId: number;
  certificateTypeId: number;
  typeName?: string;
  score: number | null;
  issueDate: string | null;
  expiryDate: string | null;
  evidenceURL: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface StudentCertificate {
  certificateId: number;
  typeName: string;
  score: number | null;
  issueDate: string | null;
  expiryDate: string | null;
  evidenceURL: string | null;
}

export interface GetCertificateTypeListParams {
  page?: number;
  limit?: number;
}

export interface CreateCertificateTypeInput {
  typeName: string;
  description?: string;
}

export interface UpdateCertificateTypeInput {
  typeName?: string;
  description?: string;
}

export interface GetCertificateListParams {
  page?: number;
  limit?: number;
  certificateTypeId?: number;
}

export interface CreateCertificateInput {
  applicationId: number;
  certificateTypeId: number;
  score?: number;
  issueDate?: string;
  expiryDate?: string;
  evidenceURL?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCertificateInput {
  score?: number;
  issueDate?: string;
  expiryDate?: string;
  evidenceURL?: string;
  metadata?: Record<string, unknown>;
}

export interface GetStudentCertificatesParams {
  page?: number;
  limit?: number;
}

export interface AddCertificateToStudentInput {
  certificateId: number;
}
