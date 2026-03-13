export interface Registration {
  sectionId: number;
  studentProfileId: number;
  studentName: string;
  subjectName: string;
}

export interface MyRegistration {
  sectionId: number;
  subjectName: string;
  lecturerName: string;
  year: string;
  status: number;
}

export interface RegistrationBySection {
  studentProfileId: number;
  fullName: string | null;
  email: string | null;
}

export interface GetRegistrationListParams {
  page?: number;
  limit?: number;
  sectionId?: number;
}

export interface GetMyRegistrationsParams {
  page?: number;
  limit?: number;
}

export interface RegisterSectionInput {
  sectionId: number;
}
