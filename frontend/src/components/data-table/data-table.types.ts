import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataTableProps<TData> {
  /** Column definitions for @tanstack/react-table */
  columns: ColumnDef<TData>[];
  /** Current page data */
  data: TData[];
  /** Server-side pagination state */
  pagination: DataTablePagination;
  /** Called when page or pageSize changes */
  onPaginationChange: (page: number, pageSize: number) => void;
  /**
   * Controlled server-side sorting state.
   * When provided, toggling a sort header will call onSortingChange
   * and the parent is responsible for re-fetching with the new sort params.
   */
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /**
   * Controlled search/filter value.
   * When provided, the toolbar shows a search input.
   * Parent is responsible for passing the value to the API.
   */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Show skeleton loading rows */
  isLoading?: boolean;
  /** Error message rendered inside the table body */
  error?: string | null;
  /** Enable row checkbox selection */
  enableRowSelection?: boolean;
  /** Enable column visibility toggle dropdown */
  enableColumnVisibility?: boolean;
  /**
   * Render a cell with actions (edit / delete / view) for each row.
   * Automatically appended as the last column with a fixed width.
   */
  renderRowActions?: (row: Row<TData>) => ReactNode;
  /**
   * Fixed pixel width for the auto-generated action column.
   * Defaults to 56px (enough for a single icon-size trigger button).
   */
  actionColumnWidth?: number;
  /**
   * Render bulk-action controls shown above the table when rows are selected.
   */
  renderBulkActions?: (selectedRows: Row<TData>[]) => ReactNode;
  /**
   * Stable row identity function passed to useReactTable.
   * Defaults to the row index if not provided.
   */
  getRowId?: (row: TData) => string;
  /** Message shown when data array is empty */
  emptyMessage?: string;
}
