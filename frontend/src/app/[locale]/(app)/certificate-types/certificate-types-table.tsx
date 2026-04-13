"use client";

import * as React from "react";
import { toast } from "sonner";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import {
  useCertificateTypeList,
  useCreateCertificateType,
  useUpdateCertificateType,
} from "@/hooks/use-certificate-types";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import type { MutationResult } from "@/types/api";
import type { CertificateType } from "@/types/certificate";
import {
  buildCreateCertificateTypePayload,
  buildUpdateCertificateTypePayload,
  CertificateTypeFormDialog,
  type CertificateTypeFormValues,
} from "./certificate-type-form-dialog";
import { CertificateTypeRowActions } from "./certificate-type-row-actions";
import { certificateTypeColumns } from "./columns";

export function CertificateTypesTable() {
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CertificateType | null>(null);

  const {
    data,
    isLoading,
    error,
    mutate: refreshList,
  } = useCertificateTypeList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

  const { mutateWithResult: createType, isLoading: isCreating } =
    useCreateCertificateType();
  const { mutateWithResult: updateType, isLoading: isUpdating } =
    useUpdateCertificateType(editing?.certificateTypeId ?? 0);
  const isSubmitting = isCreating || isUpdating;

  function openAddDialog() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEditDialog(row: CertificateType) {
    setEditing(row);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: CertificateTypeFormValues,
    mode: "create" | "edit",
  ): Promise<MutationResult<CertificateType>> {
    if (mode === "edit") {
      const result = await updateType(
        buildUpdateCertificateTypePayload(values),
      );
      if (result.ok) {
        toast.success("Cập nhật loại chứng chỉ thành công.");
        await refreshList();
        setDialogOpen(false);
        setEditing(null);
      }
      return result;
    }

    const result = await createType(buildCreateCertificateTypePayload(values));
    if (result.ok) {
      toast.success("Tạo loại chứng chỉ thành công.");
      await refreshList();
      setDialogOpen(false);
      setEditing(null);
    }
    return result;
  }

  function handlePaginationChange(newPage: number, newPageSize: number) {
    const limitChanged = newPageSize !== pageSize;
    replaceState({
      ...urlState,
      page: limitChanged ? 1 : newPage,
      limit: newPageSize,
    });
  }

  const toolbarActions: ToolbarActionGroup = {
    primary: {
      label: "Thêm mới",
      variant: "outline",
      onClick: openAddDialog,
    },
  };

  return (
    <>
      <DataTable<CertificateType>
        columns={certificateTypeColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? page,
          pageSize: data?.meta.limit ?? pageSize,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.certificateTypeId)}
        enableColumnVisibility
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder="Tìm theo tên loại chứng chỉ…"
        toolbarActions={toolbarActions}
        renderRowActions={(r) => (
          <CertificateTypeRowActions
            row={r.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshList}
          />
        )}
        messages={{ empty: "Chưa có loại chứng chỉ nào." }}
      />

      <CertificateTypeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
