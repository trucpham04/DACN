export interface Section {
  sectionId: number;
  subjectId: number;
  subjectName: string;
  lecturerProfileId: number;
  lecturerName: string;
  year: string;
  enrollmentCount: number;
  maxCapacity: number;
  status: number;
  visibility: number;
}

export interface SectionStudent {
  profileId: number;
  fullName: string | null;
  email: string | null;
}

export interface GetSectionListParams {
  page?: number;
  limit?: number;
  subjectId?: number;
  year?: string;
  status?: number;
}

export interface GetMySectionsParams {
  page?: number;
  limit?: number;
  year?: string;
}

export interface CreateSectionInput {
  subjectId: number;
  lecturerProfileId: number;
  year: string;
  maxCapacity: number;
  status?: number;
  visibility?: number;
}

export interface UpdateSectionInput {
  lecturerProfileId?: number;
  year?: string;
  maxCapacity?: number;
  status?: number;
  visibility?: number;
}

export interface UpdateSectionStatusInput {
  status: number;
}

export interface UpdateSectionVisibilityInput {
  visibility: number;
}
