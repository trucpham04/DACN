"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  enableColumnVisibility?: boolean;
  bulkActionsContent?: React.ReactNode;
  selectedCount?: number;
}

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  enableColumnVisibility = true,
  bulkActionsContent,
  selectedCount = 0,
}: DataTableToolbarProps<TData>) {
  const [localSearch, setLocalSearch] = React.useState(searchValue ?? "");
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setLocalSearch(searchValue ?? "");
  }, [searchValue]);

  React.useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange?.(value);
    }, 400);
  }

  const hidableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          {onSearchChange && (
            <Input
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-xs"
            />
          )}
        </div>

        {enableColumnVisibility && hidableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Cột hiển thị
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Hiện / ẩn cột</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hidableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {bulkActionsContent && selectedCount > 0 && (
        <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2">
          <span className="text-sm text-muted-foreground">
            {selectedCount} dòng đã chọn
          </span>
          <div className="flex items-center gap-2">{bulkActionsContent}</div>
        </div>
      )}
    </div>
  );
}
