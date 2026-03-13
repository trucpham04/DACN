"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataTableProps } from "./data-table.types";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

// Pre-defined string keys avoid array-index-as-key lint warnings for skeleton rows
const SKELETON_ROW_IDS = ["sk-0", "sk-1", "sk-2", "sk-3", "sk-4"] as const;

export function DataTable<TData>({
  columns: columnsProp,
  data,
  pagination,
  onPaginationChange,
  sorting: sortingProp,
  onSortingChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  isLoading = false,
  error,
  enableRowSelection = false,
  enableColumnVisibility = true,
  renderRowActions,
  renderBulkActions,
  getRowId,
  emptyMessage = "Không có dữ liệu.",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(sortingProp ?? []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Keep internal sorting in sync when controlled from parent
  React.useEffect(() => {
    if (sortingProp !== undefined) {
      setSorting(sortingProp);
    }
  }, [sortingProp]);

  const { page, pageSize } = pagination;

  // Reset row selection whenever the page or page-size changes so stale
  // selections from a previous page are not carried forward.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional trigger on pagination change
  React.useEffect(() => {
    setRowSelection({});
  }, [page, pageSize]);

  const columns = React.useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = [];

    if (enableRowSelection) {
      cols.push({
        id: "__select__",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) {
                el.indeterminate =
                  table.getIsSomePageRowsSelected() &&
                  !table.getIsAllPageRowsSelected();
              }
            }}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Chọn tất cả"
            className="cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Chọn dòng"
            className="cursor-pointer"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    cols.push(...columnsProp);

    if (renderRowActions) {
      cols.push({
        id: "__actions__",
        header: () => null,
        cell: ({ row }) => renderRowActions(row),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [columnsProp, enableRowSelection, renderRowActions]);

  const { total } = pagination;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { sorting, columnVisibility, rowSelection },
    manualPagination: true,
    manualSorting: true,
    enableRowSelection,
    getRowId,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        enableColumnVisibility={enableColumnVisibility}
        selectedCount={selectedRows.length}
        bulkActionsContent={
          enableRowSelection && renderBulkActions && selectedRows.length > 0
            ? renderBulkActions(selectedRows)
            : null
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="flex cursor-pointer select-none items-center gap-1 text-left"
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <span className="text-xs text-muted-foreground">
                          {header.column.getIsSorted() === "asc"
                            ? "▲"
                            : header.column.getIsSorted() === "desc"
                              ? "▼"
                              : "⇅"}
                        </span>
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              SKELETON_ROW_IDS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {table
                    .getAllColumns()
                    .filter((col) => col.getIsVisible())
                    .map((col) => (
                      <TableCell key={`${rowKey}-${col.id}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
