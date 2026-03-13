"use client";

import * as React from "react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { useDeleteRoom } from "@/hooks/use-rooms";
import type { Room } from "@/types/room";
import { roomColumns } from "./columns";

// ---------------------------------------------------------------------------
// Mock data — chỉ dùng để test hiển thị, xóa khi kết nối API thật
// ---------------------------------------------------------------------------
const MOCK_ROOMS: Room[] = Array.from({ length: 35 }, (_, i) => ({
  roomId: i + 1,
  roomName: `P.${100 + i + 1}`,
  roomType: ["Lý thuyết", "Thực hành", "Hội trường"][i % 3],
  campus: ["Cơ sở 1", "Cơ sở 2"][i % 2],
  capacity: [30, 40, 50, 80, 120][i % 5],
  status: ["active", "inactive", "maintenance"][i % 3],
}));

function useMockRoomList(page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const items = MOCK_ROOMS.slice(start, start + pageSize);
  return {
    data: { items, meta: { page, limit: pageSize, total: MOCK_ROOMS.length } },
    isLoading: false,
    error: undefined,
  };
}
// ---------------------------------------------------------------------------

export function RoomsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // TODO: swap useMockRoomList → useRoomList({ page, limit: pageSize }) khi kết nối API
  const { data, isLoading, error } = useMockRoomList(page, pageSize);

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  return (
    <DataTable<Room>
      columns={roomColumns}
      data={data?.items ?? []}
      pagination={{
        page,
        pageSize,
        total: data?.meta.total ?? 0,
      }}
      onPaginationChange={handlePaginationChange}
      isLoading={isLoading}
      error={error ?? null}
      getRowId={(row) => String(row.roomId)}
      enableRowSelection
      enableColumnVisibility
      emptyMessage="Chưa có phòng học nào."
      renderRowActions={(row) => <RoomRowActions room={row.original} />}
      renderBulkActions={(selectedRows) => (
        <BulkDeleteButton
          roomIds={selectedRows.map((r) => r.original.roomId)}
        />
      )}
    />
  );
}

function RoomRowActions({ room }: { room: Room }) {
  const { mutate: mutateDeleteRoom, isLoading } = useDeleteRoom(room.roomId);

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm">
        Sửa
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading}
        onClick={() => mutateDeleteRoom()}
      >
        Xóa
      </Button>
    </div>
  );
}

function BulkDeleteButton({ roomIds }: { roomIds: number[] }) {
  function handleBulkDelete() {
    // TODO: wire up bulk-delete API when endpoint is available
    console.log("Bulk delete room IDs:", roomIds);
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
      Xóa {roomIds.length} phòng
    </Button>
  );
}
