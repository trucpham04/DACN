import apiClient, { paginatedFetcher } from "./api-client";
import { buildQuery } from "./utils";
import type { PaginatedData } from "@/types/api";
import type {
  Room,
  GetRoomListParams,
  GetAvailableRoomsParams,
  CreateRoomInput,
  UpdateRoomInput,
} from "@/types/room";
import type { Schedule } from "@/types/schedule";

export function getRoomListUrl(params: GetRoomListParams = {}): string {
  return `/rooms${buildQuery(params)}`;
}

export function getAvailableRoomsUrl(params: GetAvailableRoomsParams): string {
  return `/rooms/available${buildQuery(params)}`;
}

export function getRoomSchedulesUrl(
  roomId: number,
  params: { startDate?: string; endDate?: string } = {},
): string {
  return `/rooms/${roomId}/schedules${buildQuery(params)}`;
}

export async function getRoomList(
  params: GetRoomListParams = {},
): Promise<PaginatedData<Room>> {
  return paginatedFetcher<Room>(getRoomListUrl(params));
}

export async function getRoomDetail(roomId: number): Promise<Room> {
  const res = await apiClient.get<Room>(`/rooms/${roomId}`);
  return res.data as Room;
}

export async function getAvailableRooms(params: GetAvailableRoomsParams): Promise<Room[]> {
  const res = await apiClient.get<Room[]>(getAvailableRoomsUrl(params));
  return (res.data ?? []) as Room[];
}

export async function getRoomSchedules(
  roomId: number,
  params: { startDate?: string; endDate?: string } = {},
): Promise<Schedule[]> {
  const res = await apiClient.get<Schedule[]>(getRoomSchedulesUrl(roomId, params));
  return (res.data ?? []) as Schedule[];
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const res = await apiClient.post<Room>("/rooms", input);
  return res.data as Room;
}

export async function updateRoom(roomId: number, input: UpdateRoomInput): Promise<Room> {
  const res = await apiClient.put<Room>(`/rooms/${roomId}`, input);
  return res.data as Room;
}

export async function deleteRoom(roomId: number): Promise<null> {
  await apiClient.delete(`/rooms/${roomId}`);
  return null;
}
