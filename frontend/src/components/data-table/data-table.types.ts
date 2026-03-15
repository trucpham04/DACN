import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { ToolbarActionGroup } from "./data-table-toolbar.types";

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
  onSearch?: (value: string) => void;
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
   * Automatically appended as the last column
   */
  renderRowActions?: (row: Row<TData>) => ReactNode;
  /**
   * Fixed pixel width for the auto-generated action column.
   * Defaults to 56px (enough for a single icon-size trigger button).
   */
  actionColumnWidth?: number;
  /**
   * Declarative toolbar action group.  The primary action is always rendered
   * as a full button; additional actions land in a chevron dropdown.
   * Accepts either a static config or a factory that receives the currently
   * selected rows so callers can drive `disabled` from selection state.
   */
  toolbarActions?:
    | ToolbarActionGroup
    | ((selectedRows: Row<TData>[]) => ToolbarActionGroup);
  /**
   * Stable row identity function passed to useReactTable.
   * Defaults to the row index if not provided.
   */
  getRowId?: (row: TData) => string;
  /** Message shown when data array is empty */
  emptyMessage?: string;
  /**
   * Called when a data row is double-clicked.
   * DataTable forwards the tanstack Row object; the page is responsible
   * for deciding what to do (open dialog, navigate, etc.).
   * When provided, rows also get a `cursor-pointer` affordance.
   */
  onRowDoubleClick?: (row: Row<TData>) => void;
}
