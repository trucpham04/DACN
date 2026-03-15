"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteRoom } from "@/hooks/use-rooms";
import type { Room } from "@/types/room";
import { roomColumns } from "./columns";

// ---------------------------------------------------------------------------
// Mock data — chỉ dùng để test hiển thị, xóa khi kết nối API thật
// ---------------------------------------------------------------------------
const MOCK_ROOMS: Room[] = Array.from({ length: 100 }, (_, i) => ({
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
      actionColumnWidth={64}
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
    <div className="flex w-full items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            <TrashIcon className="size-4" />
            Xóa
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phòng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa phòng{" "}
              <span className="text-foreground font-medium">
                {room.roomName ?? `#${room.roomId}`}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isLoading}
              onClick={() => mutateDeleteRoom()}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button variant="ghost" aria-label="Hành động">
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost" size="icon-sm" aria-label="Hành động">
    //       <EllipsisIcon className="size-4" />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-24">
    //     <DropdownMenuItem onSelect={() => {}}>
    //       <PencilIcon className="size-4" />
    //       Sửa
    //     </DropdownMenuItem>
    //     {/* <DropdownMenuSeparator /> */}
    //     <DropdownMenuItem
    //       variant="destructive"
    //       disabled={isLoading}
    //       onSelect={() => mutateDeleteRoom()}
    //     >
    //       <TrashIcon className="size-4" />
    //       Xóa
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

function BulkDeleteButton({ roomIds }: { roomIds: number[] }) {
  function handleBulkDelete() {
    // TODO: wire up bulk-delete API when endpoint is available
    console.log("Bulk delete room IDs:", roomIds);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Xóa {roomIds.length} phòng
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa hàng loạt</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa {roomIds.length} phòng đã chọn? Hành động này
            không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleBulkDelete}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
