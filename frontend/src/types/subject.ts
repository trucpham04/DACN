export interface Subject {
  subjectId: number;
  subjectName: string;
  periods: number;
  prerequisiteSubjectId?: number | null;
}

export interface GetSubjectListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateSubjectInput {
  subjectName: string;
  periods: number;
  prerequisiteSubjectId?: number;
}

export interface UpdateSubjectInput {
  subjectName?: string;
  periods?: number;
  prerequisiteSubjectId?: number | null;
}
