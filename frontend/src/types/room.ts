export interface Room {
  roomId: number;
  roomName: string;
  roomType: string | null;
  campus: string | null;
  capacity: number | null;
  status: string | null;
}

export interface GetRoomListParams {
  page?: number;
  limit?: number;
  campus?: string;
  roomType?: string;
  status?: string;
}

export interface GetAvailableRoomsParams {
  date: string;
  startPeriod: number;
  endPeriod: number;
  capacity?: number;
}

export interface CreateRoomInput {
  roomName: string;
  roomType: string;
  campus: string;
  capacity: number;
  status?: string;
}

export interface UpdateRoomInput {
  roomName?: string;
  roomType?: string;
  campus?: string;
  capacity?: number;
  status?: string;
}
