import type { ColumnDef } from "@tanstack/react-table";
import { ActivityIcon, MapPinIcon, TagIcon, UsersIcon } from "lucide-react";
import { ColHeader } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Room } from "@/types/room";

const STATUS_STYLES: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  maintenance:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  maintenance: "Bảo trì",
};

function RoomStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const key = status.toLowerCase();
  return (
    <Badge
      variant="ghost"
      className={cn(STATUS_STYLES[key] ?? "bg-muted text-muted-foreground")}
    >
      {STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export const roomColumns: ColumnDef<Room>[] = [
  {
    accessorKey: "roomName",
    header: () => <ColHeader label="Tên phòng" />,
    meta: { visibilityLabel: "Tên phòng" },
    enableSorting: false,
  },
  {
    accessorKey: "roomType",
    header: () => <ColHeader icon={TagIcon} label="Loại phòng" />,
    meta: { visibilityLabel: "Loại phòng" },
    enableSorting: false,
    cell: ({ row }) => row.original.roomType ?? "—",
  },
  {
    accessorKey: "campus",
    header: () => <ColHeader icon={MapPinIcon} label="Cơ sở" />,
    meta: { visibilityLabel: "Cơ sở" },
    enableSorting: true,
    cell: ({ row }) => row.original.campus ?? "—",
  },
  {
    accessorKey: "capacity",
    header: () => <ColHeader icon={UsersIcon} label="Sức chứa" />,
    meta: { visibilityLabel: "Sức chứa" },
    enableSorting: true,
    cell: ({ row }) =>
      row.original.capacity != null ? (
        <span>{row.original.capacity} chỗ</span>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "status",
    header: () => <ColHeader icon={ActivityIcon} label="Trạng thái" />,
    meta: { visibilityLabel: "Trạng thái" },
    enableSorting: false,
    cell: ({ row }) => <RoomStatusBadge status={row.original.status} />,
  },
];
