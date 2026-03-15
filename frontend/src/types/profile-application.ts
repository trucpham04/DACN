export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface ProfileApplication {
  applicationId: number;
  studentProfileId: number;
  studentName?: string;
  applicationStatus: ApplicationStatus | null;
  submissionDate: string | null;
  reviewedByProfileId?: number | null;
  reviewDate?: string | null;
  reviewNotes?: string | null;
}

export interface GetApplicationListParams {
  page?: number;
  limit?: number;
  applicationStatus?: ApplicationStatus;
}

export interface GetMyApplicationsParams {
  page?: number;
  limit?: number;
}

export interface ReviewApplicationInput {
  applicationStatus: "approved" | "rejected";
  reviewNotes?: string;
}
