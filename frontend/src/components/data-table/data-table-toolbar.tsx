"use client";

import type { Table } from "@tanstack/react-table";
import { ChevronDown, SearchIcon, Settings2 } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "../ui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import type { ToolbarActionGroup } from "./data-table-toolbar.types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  enableColumnVisibility?: boolean;
  toolbarActions?: ToolbarActionGroup;
  selectedCount?: number;
}

export function DataTableToolbar<TData>({
  table,
  searchValue,
  onSearchChange,
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
  enableColumnVisibility = true,
  toolbarActions,
  selectedCount: _selectedCount = 0,
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

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      onSearch?.(localSearch);
    }
  }

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

  const visibleMenuActions = toolbarActions?.menuActions?.filter(
    (a) => !a.hidden,
  );
  const hasMenuActions = visibleMenuActions && visibleMenuActions.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <InputGroup>
            <InputGroupInput
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-xs"
              onKeyDown={handleSearchKeyDown}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {enableColumnVisibility && hidableColumns.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings2 className="size-4" />
                Ẩn cột
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Hiện / ẩn cột</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hidableColumns.map((column) => {
                const label =
                  column.columnDef.meta?.visibilityLabel ??
                  (typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {toolbarActions && (
          <ButtonGroup>
            {!toolbarActions.primary.hidden && (
              <Button
                variant={toolbarActions.primary.variant ?? "outline"}
                size="sm"
                disabled={toolbarActions.primary.disabled}
                onClick={toolbarActions.primary.onClick}
              >
                {toolbarActions.primary.icon && (
                  <toolbarActions.primary.icon className="size-4" />
                )}
                {toolbarActions.primary.label}
              </Button>
            )}

            {hasMenuActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {visibleMenuActions.map((action) => (
                    <DropdownMenuItem
                      key={action.label}
                      disabled={action.disabled}
                      onSelect={(event) => {
                        event.preventDefault();
                        action.onClick();
                      }}
                    >
                      {action.icon && <action.icon className="size-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}
