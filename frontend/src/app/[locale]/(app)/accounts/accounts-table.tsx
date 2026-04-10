"use client";

import type { Row } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import type { ToolbarActionGroup } from "@/components/data-table";
import { DataTable } from "@/components/data-table";
import { toast } from "@/components/ui/sonner";
import {
  useAccountList,
  useCreateAccount,
  useUpdateAccount,
} from "@/hooks/use-accounts";
import { useListTableUrl } from "@/hooks/use-list-table-url";
import { useCreateProfile } from "@/hooks/use-profiles";
import type { Account } from "@/types/account";
import type { MutationResult } from "@/types/api";
import { AccountDetailSheet } from "./account-detail-sheet";
import {
  AccountFormDialog,
  type AccountFormValues,
  buildCreateAccountPayload,
  buildUpdateAccountPayload,
} from "./account-form-dialog";
import { AccountRowActions } from "./account-row-actions";
import { accountColumns } from "./columns";

export function AccountsTable() {
  const { state: urlState, replaceState } = useListTableUrl();
  const { page, limit: pageSize, q: search } = urlState;

  // Detail sheet
  const [detailAccount, setDetailAccount] = React.useState<Account | null>(
    null,
  );

  // Create / edit dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(
    null,
  );

  const {
    data,
    isLoading,
    error,
    mutate: refreshAccounts,
  } = useAccountList({
    page,
    limit: pageSize,
    search: search.trim() || undefined,
  });

  console.log("data", data);

  const { mutateWithResult: createAccount, isLoading: isCreating } =
    useCreateAccount();
  const { mutateWithResult: createProfile } = useCreateProfile();
  const { mutateWithResult: updateAccount, isLoading: isUpdating } =
    useUpdateAccount(editingAccount?.accountId ?? 0);
  const isSubmitting = isCreating || isUpdating;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function openAddDialog() {
    setEditingAccount(null);
    setDialogOpen(true);
  }

  function openEditDialog(account: Account) {
    setEditingAccount(account);
    setDialogOpen(true);
  }

  async function handleFormSubmit(
    values: AccountFormValues,
    mode: "create" | "edit",
  ): Promise<MutationResult<Account>> {
    if (mode === "edit") {
      const result = await updateAccount(buildUpdateAccountPayload(values));
      if (result.ok) {
        toast.success("Cập nhật tài khoản thành công.");
        await refreshAccounts();
        setDialogOpen(false);
        setEditingAccount(null);
      } else {
        toast.error(
          result.error?.message ??
            "Cập nhật tài khoản thất bại. Vui lòng thử lại.",
        );
      }
      return result;
    }

    const result = await createAccount(buildCreateAccountPayload(values));
    if (result.ok) {
      const createdAccount = result.data;
      if (createdAccount) {
        const createProfileResult = await createProfile({
          accountId: createdAccount.accountId,
          fullName: createdAccount.username,
        });

        if (!createProfileResult.ok) {
          toast.error(
            createProfileResult.error?.message ??
              "Tạo profile tự động thất bại. Vui lòng tạo profile thủ công.",
          );
        } else {
          toast.success("Tạo tài khoản và profile thành công.");
        }
      } else {
        toast.success("Tạo tài khoản thành công.");
      }

      await refreshAccounts();
      setDialogOpen(false);
      setEditingAccount(null);
    } else {
      toast.error(
        result.error?.message ?? "Tạo tài khoản thất bại. Vui lòng thử lại.",
      );
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

  function handleRowDoubleClick(row: Row<Account>) {
    setDetailAccount(row.original);
  }

  async function handleAccountUpdated(updatedAccount: Account) {
    setDetailAccount(updatedAccount);
    await refreshAccounts();
  }

  function buildToolbarActions(
    _selectedRows: Row<Account>[],
  ): ToolbarActionGroup {
    return {
      primary: {
        label: "Thêm mới",
        icon: PlusIcon,
        variant: "outline",
        onClick: openAddDialog,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <DataTable<Account>
        columns={accountColumns}
        data={data?.items ?? []}
        pagination={{
          page: data?.meta.page ?? page,
          pageSize: data?.meta.limit ?? pageSize,
          total: data?.meta.total ?? 0,
        }}
        onPaginationChange={handlePaginationChange}
        isLoading={isLoading}
        error={error?.message ?? null}
        getRowId={(row) => String(row.accountId)}
        enableRowSelection
        enableColumnVisibility
        toolbarActions={buildToolbarActions}
        searchValue={search}
        onSearchChange={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        onSearch={(value) => {
          replaceState({ ...urlState, page: 1, q: value });
        }}
        searchPlaceholder="Tìm theo username, email..."
        onRowDoubleClick={handleRowDoubleClick}
        renderRowActions={(row) => (
          <AccountRowActions
            account={row.original}
            onEdit={openEditDialog}
            onDeleteSuccess={refreshAccounts}
          />
        )}
      />

      <AccountFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingAccount={editingAccount}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <AccountDetailSheet
        account={detailAccount}
        onClose={() => setDetailAccount(null)}
        onAccountUpdated={handleAccountUpdated}
      />
    </>
  );
}
