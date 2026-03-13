"use client";

import {
  createRoom,
  deleteRoom,
  getAvailableRooms,
  getAvailableRoomsUrl,
  getRoomDetail,
  getRoomList,
  getRoomListUrl,
  getRoomSchedules,
  getRoomSchedulesUrl,
  updateRoom,
} from "@/services/room-service";
import type { PaginatedData } from "@/types/api";
import type {
  CreateRoomInput,
  GetAvailableRoomsParams,
  GetRoomListParams,
  Room,
  UpdateRoomInput,
} from "@/types/room";
import type { Schedule } from "@/types/schedule";
import { useFetchWithFetcher } from "./use-fetch";
import { useMutation } from "./use-mutation";

export function useRoomList(params: GetRoomListParams = {}) {
  return useFetchWithFetcher<PaginatedData<Room>>(getRoomListUrl(params), () =>
    getRoomList(params),
  );
}

export function useRoomDetail(roomId?: number) {
  return useFetchWithFetcher<Room>(
    roomId ? `/rooms/${roomId}` : null,
    () => getRoomDetail(roomId!),
    { enabled: !!roomId },
  );
}

export function useAvailableRooms(params?: GetAvailableRoomsParams) {
  return useFetchWithFetcher<Room[]>(
    params ? getAvailableRoomsUrl(params) : null,
    () => getAvailableRooms(params!),
    { enabled: !!params },
  );
}

export function useRoomSchedules(
  roomId?: number,
  params: { startDate?: string; endDate?: string } = {},
) {
  return useFetchWithFetcher<Schedule[]>(
    roomId ? getRoomSchedulesUrl(roomId, params) : null,
    () => getRoomSchedules(roomId!, params),
    { enabled: !!roomId },
  );
}

export function useCreateRoom() {
  return useMutation<Room, CreateRoomInput>("/rooms", createRoom);
}

export function useUpdateRoom(roomId: number) {
  return useMutation<Room, UpdateRoomInput>(`/rooms/${roomId}`, (input) =>
    updateRoom(roomId, input),
  );
}

export function useDeleteRoom(roomId: number) {
  return useMutation<null, void>(`/rooms/${roomId}/delete`, () =>
    deleteRoom(roomId),
  );
}
