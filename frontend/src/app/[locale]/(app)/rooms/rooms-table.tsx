"use client";

import type { Row } from "@tanstack/react-table";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/data-table";
import type { ToolbarActionGroup } from "@/components/data-table/data-table-toolbar.types";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

const STATUS_LABEL: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  maintenance: "Đang bảo trì",
};

export function RoomsTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [detailRoom, setDetailRoom] = React.useState<Room | null>(null);

  // TODO: swap useMockRoomList → useRoomList({ page, limit: pageSize }) khi kết nối API
  const { data, isLoading, error } = useMockRoomList(page, pageSize);

  function handlePaginationChange(newPage: number, newPageSize: number) {
    setPage(newPage);
    setPageSize(newPageSize);
  }

  function handleAddRoom() {
    // TODO: mở dialog / navigate tới trang tạo mới
  }

  function handleRowDoubleClick(row: Row<Room>) {
    setDetailRoom(row.original);
  }

  function buildToolbarActions(selectedRows: Row<Room>[]): ToolbarActionGroup {
    const hasSelection = selectedRows.length > 0;
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: handleAddRoom,
      },
      menuActions: [
        {
          label: `Xóa ${hasSelection ? `${selectedRows.length} phòng` : "phòng"}`,
          icon: TrashIcon,
          disabled: !hasSelection,
          onClick: () => {
            // TODO: gọi API xóa hàng loạt cho selectedRows
          },
        },
      ],
    };
  }

  return (
    <>
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
        toolbarActions={buildToolbarActions}
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => <RoomRowActions room={row.original} />}
      />

      <Sheet
        open={detailRoom !== null}
        onOpenChange={(open) => {
          if (!open) setDetailRoom(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              Chi tiết phòng — {detailRoom?.roomName ?? ""}
            </SheetTitle>
          </SheetHeader>

          {detailRoom && (
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
              <dt className="text-muted-foreground font-medium">Mã phòng</dt>
              <dd>{detailRoom.roomId}</dd>

              <dt className="text-muted-foreground font-medium">Tên phòng</dt>
              <dd>{detailRoom.roomName}</dd>

              <dt className="text-muted-foreground font-medium">Loại phòng</dt>
              <dd>{detailRoom.roomType ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Cơ sở</dt>
              <dd>{detailRoom.campus ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Sức chứa</dt>
              <dd>
                {detailRoom.capacity != null
                  ? `${detailRoom.capacity} chỗ`
                  : "—"}
              </dd>

              <dt className="text-muted-foreground font-medium">Trạng thái</dt>
              <dd>
                {detailRoom.status
                  ? (STATUS_LABEL[detailRoom.status] ?? detailRoom.status)
                  : "—"}
              </dd>
            </dl>
          )}
        </SheetContent>
      </Sheet>
    </>
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

      <Button variant="ghost" aria-label="Sửa">
        <PencilIcon className="size-4" />
        Sửa
      </Button>
    </div>
  );
}
