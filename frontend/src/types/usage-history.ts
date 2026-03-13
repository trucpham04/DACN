export interface UsageHistory {
  usageHistoryId: number;
  roomId: number;
  roomName?: string;
  startTime: string;
  endTime: string;
  note: string | null;
}

export interface UsageHistoryDetail extends UsageHistory {
  sections: Array<{ sectionId: number; subjectName: string }>;
}

export interface GetUsageHistoryListParams {
  page?: number;
  limit?: number;
  roomId?: number;
}

export interface CreateUsageHistoryInput {
  roomId: number;
  startTime: string;
  endTime: string;
  note?: string;
}

export interface UpdateUsageHistoryInput {
  startTime?: string;
  endTime?: string;
  note?: string;
}

export interface AddSectionToUsageHistoryInput {
  sectionId: number;
}
