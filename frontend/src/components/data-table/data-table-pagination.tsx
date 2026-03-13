"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "start" | "end" };

function buildPageRange(current: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page" as const,
      value: i + 1,
    }));
  }

  const items: PageItem[] = [{ type: "page", value: 1 }];
  if (current > 3) items.push({ type: "ellipsis", id: "start" });

  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(totalPages - 1, current + 1);
  for (let p = rangeStart; p <= rangeEnd; p++) {
    items.push({ type: "page", value: p });
  }

  if (current < totalPages - 2) items.push({ type: "ellipsis", id: "end" });
  items.push({ type: "page", value: totalPages });
  return items;
}

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPaginationChange,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const pageRange = buildPageRange(page, totalPages);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total === 0
          ? "Không có bản ghi nào"
          : `Hiển thị ${startItem}–${endItem} trong ${total} bản ghi`}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Hiển thị</span>
          <select
            value={pageSize}
            onChange={(e) => onPaginationChange(1, Number(e.target.value))}
            className={cn(
              "rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs",
              "focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            )}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground">/ trang</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(1, pageSize)}
            disabled={page <= 1}
          >
            Đầu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(page - 1, pageSize)}
            disabled={page <= 1}
          >
            Trước
          </Button>

          {pageRange.map((item) =>
            item.type === "ellipsis" ? (
              <span
                key={`ellipsis-${item.id}`}
                className="px-1.5 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={`page-${item.value}`}
                variant={item.value === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPaginationChange(item.value, pageSize)}
                disabled={item.value === page}
                aria-current={item.value === page ? "page" : undefined}
              >
                {item.value}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(page + 1, pageSize)}
            disabled={page >= totalPages}
          >
            Sau
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange(totalPages, pageSize)}
            disabled={page >= totalPages}
          >
            Cuối
          </Button>
        </div>
      </div>
    </div>
  );
}
