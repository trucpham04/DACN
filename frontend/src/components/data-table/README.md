# Hướng Dẫn Sử Dụng DataTable

Tài liệu này mô tả cách áp dụng `@/components/data-table` cho các màn hình quản lý (Users, Rooms, Classes, Subjects, ...).

## 1) Tổng quan kiến trúc

- `DataTable` là component dùng chung, quản lý:
  - row selection
  - pagination UI
  - sort state
  - search input + callback
  - toolbar actions (primary + dropdown)
- Từng page (Rooms/Users/...) tự định nghĩa:
  - columns
  - row actions
  - toolbar actions
  - hành vi double click row
- `DataTableToolbar` chỉ render UI theo config, không chứa logic domain.

## 2) API chính cần biết

Import từ barrel:

```ts
import { DataTable } from "@/components/data-table";
import type { ToolbarActionGroup } from "@/components/data-table";
```

Props quan trọng của `DataTableProps<TData>`:

- Bắt buộc:
  - `columns`
  - `data`
  - `pagination`
  - `onPaginationChange`
- Thường dùng:
  - `isLoading`, `error`, `emptyMessage`
  - `searchValue`, `onSearchChange`, `onSearch`, `searchPlaceholder`
  - `sorting`, `onSortingChange`
  - `enableRowSelection`, `enableColumnVisibility`
  - `toolbarActions`
  - `renderRowActions`
  - `onRowDoubleClick`
  - `getRowId`

## 3) Bước 1 - Tạo kiểu dữ liệu và state màn hình

Trong page quản lý, tạo state cơ bản:

```tsx
const [page, setPage] = React.useState(1);
const [pageSize, setPageSize] = React.useState(10);
const [search, setSearch] = React.useState("");
const [sorting, setSorting] = React.useState<SortingState>([]);
```

Nếu có backend, map state này vào query API.

## 4) Bước 2 - Định nghĩa columns

Tạo file `columns.tsx` cho từng module và khai báo `ColumnDef<T>[]`.

Quan trọng:

- Nếu muốn menu `Ẩn cột` hiển thị nhãn dễ đọc, thêm `meta.visibilityLabel`.
- Header có thể là string hoặc component (`ColHeader`).

Ví dụ:

```tsx
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: () => <ColHeader label="Họ tên" />,
    meta: { visibilityLabel: "Họ tên" },
  },
  {
    accessorKey: "email",
    header: () => <ColHeader label="Email" />,
    meta: { visibilityLabel: "Email" },
  },
];
```

`visibilityLabel` được khai báo qua module augmentation trong `data-table-column-meta.d.ts`.

## 5) Bước 3 - Định nghĩa toolbar actions theo page

`toolbarActions` nhận:

- một object `ToolbarActionGroup`, hoặc
- một function `(selectedRows) => ToolbarActionGroup`

Nên dùng function để bật/tắt bulk action theo selection.

```tsx
function buildToolbarActions(selectedRows: Row<User>[]): ToolbarActionGroup {
  const hasSelection = selectedRows.length > 0;

  return {
    primary: {
      label: "Thêm mới",
      onClick: handleCreateUser,
      variant: "outline",
    },
    menuActions: [
      {
        label: `Xóa ${hasSelection ? selectedRows.length : ""} người dùng`,
        disabled: !hasSelection,
        onClick: () => handleBulkDelete(selectedRows),
      },
    ],
  };
}
```

## 6) Bước 4 - Gắn row actions và double-click

### Row actions

Dùng `renderRowActions` để render nút sửa/xóa theo từng dòng:

```tsx
renderRowActions={(row) => <UserRowActions user={row.original} />}
```

### Double-click row

Dùng `onRowDoubleClick` để mở dialog/sheet chi tiết:

```tsx
onRowDoubleClick={(row) => setDetailUser(row.original)}
```

`DataTable` sẽ chỉ forward sự kiện, page tự quyết định UX.

## 7) Bước 5 - Search đúng cách

`DataTable` hỗ trợ 2 callback:

- `onSearchChange(value)`: gọi sau debounce khi người dùng đang gõ.
- `onSearch(value)`: gọi khi người dùng bấm `Enter`.

Mẫu dùng để tối ưu API:

```tsx
<DataTable<User>
  searchValue={search}
  onSearchChange={setSearch}
  onSearch={(value) => refetchUsers({ search: value })}
  searchPlaceholder="Tìm theo họ tên, email..."
  {...otherProps}
/>
```

## 8) Bước 6 - Render DataTable đầy đủ

Mẫu khung tiêu chuẩn:

```tsx
<DataTable<User>
  columns={userColumns}
  data={data?.items ?? []}
  pagination={{
    page,
    pageSize,
    total: data?.meta.total ?? 0,
  }}
  onPaginationChange={(newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }}
  sorting={sorting}
  onSortingChange={setSorting}
  searchValue={search}
  onSearchChange={setSearch}
  onSearch={(value) => refetchUsers({ search: value })}
  getRowId={(row) => String(row.userId)}
  enableRowSelection
  enableColumnVisibility
  toolbarActions={buildToolbarActions}
  renderRowActions={(row) => <UserRowActions user={row.original} />}
  onRowDoubleClick={(row) => setDetailUser(row.original)}
  isLoading={isLoading}
  error={error ?? null}
  emptyMessage="Chưa có dữ liệu."
/>
```

## 9) Checklist sau khi áp dụng cho màn hình mới

- [ ] Menu `Ẩn cột` hiển thị đúng nhãn tự nhiên (không ra key kỹ thuật).
- [ ] Không chọn dòng nào thì bulk action bị `disabled`.
- [ ] Chọn >= 1 dòng thì bulk action được enable.
- [ ] Đổi page/pageSize thì selection được reset.
- [ ] Bấm Enter trong ô search thì `onSearch` được gọi.
- [ ] Double-click row mở đúng dialog/sheet chi tiết.

## 10) Lưu ý implementation

- Luôn truyền `getRowId` để tránh selection sai khi dữ liệu thay đổi.
- Không đặt logic domain vào `DataTableToolbar`.
- Khi dùng `DropdownMenuItem`, ưu tiên `onSelect` + `event.preventDefault()` để kiểm soát hành vi đóng menu.
- Nếu page không cần sort/search/select, bỏ qua props tương ứng (mặc định là an toàn).
