"use client";

import { Pencil, UserPlus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import {
  useCreateProfile,
  useProfileDetail,
  useUpdateProfile,
} from "@/hooks/use-profiles";
import type { Account } from "@/types/account";
import type { MutationResult } from "@/types/api";
import type { Profile } from "@/types/profile";
import {
  buildUpdateProfilePayload,
  ProfileFormDialog,
  type ProfileFormValues,
} from "../profile/profile-form-dialog";
import { ACCOUNT_ROLE_LABELS } from "./account.constants";

interface AccountDetailSheetProps {
  account: Account | null;
  onClose: () => void;
  onAccountUpdated?: (updatedAccount: Account) => Promise<void> | void;
}

export function AccountDetailSheet({
  account,
  onClose,
  onAccountUpdated,
}: AccountDetailSheetProps) {
  const [editProfileOpen, setEditProfileOpen] = React.useState(false);

  React.useEffect(() => {
    setEditProfileOpen(false);
  }, [account?.accountId]);

  const profileId = account?.profile?.profileId;

  const { mutateWithResult: createProfile, isLoading: isCreatingProfile } =
    useCreateProfile();
  const { data: profileDetail, mutate: refreshProfileDetail } =
    useProfileDetail(profileId);
  const { mutateWithResult: updateProfile, isLoading: isUpdatingProfile } =
    useUpdateProfile(profileId ?? 0);

  async function handleCreateProfile() {
    if (!account) return;
    if (account.profile) {
      toast.info("Tài khoản đã có profile.");
      return;
    }

    const result = await createProfile({
      accountId: account.accountId,
      fullName: account.username,
    });

    if (!result.ok || !result.data) {
      toast.error(result.error?.message ?? "Tạo profile thất bại.");
      return;
    }

    const updatedAccount: Account = {
      ...account,
      profile: {
        profileId: result.data.profileId,
        fullName: result.data.fullName,
        email: result.data.email,
        avatar: result.data.avatar,
        status: result.data.status,
      },
    };

    await onAccountUpdated?.(updatedAccount);
    await refreshProfileDetail();
    toast.success("Tạo profile thành công.");
  }

  async function handleSubmitUpdateProfile(
    values: ProfileFormValues,
  ): Promise<MutationResult<Profile>> {
    if (!account || !profileId) {
      return {
        ok: false,
        error: {
          message: "Tài khoản chưa có profile để cập nhật.",
          statusCode: 400,
        },
      };
    }

    const payload = buildUpdateProfilePayload(values, {
      profile: profileDetail,
    });
    if (Object.keys(payload).length === 0) {
      toast.info("Không có thay đổi để cập nhật.");
      return { ok: true, data: profileDetail ?? undefined };
    }

    const result = await updateProfile(payload);
    if (!result.ok || !result.data) {
      toast.error(result.error?.message ?? "Cập nhật profile thất bại.");
      return result;
    }

    const updatedAccount: Account = {
      ...account,
      email: result.data.email ?? account.email,
      profile: {
        profileId: result.data.profileId,
        fullName: result.data.fullName,
        email: result.data.email,
        avatar: result.data.avatar,
        status: result.data.status,
      },
    };

    await onAccountUpdated?.(updatedAccount);
    await refreshProfileDetail();
    setEditProfileOpen(false);
    toast.success("Cập nhật profile thành công.");

    return result;
  }

  return (
    <>
      <Sheet
        open={account !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditProfileOpen(false);
            onClose();
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              Chi tiết tài khoản — {account?.username ?? ""}
            </SheetTitle>
          </SheetHeader>

          {account && (
            <div className="flex items-center gap-2 px-4 py-3">
              {!account.profile && (
                <Button
                  variant="outline"
                  onClick={() => {
                    void handleCreateProfile();
                  }}
                  disabled={isCreatingProfile}
                >
                  <UserPlus className="size-4" />
                  {isCreatingProfile ? "Đang tạo..." : "Tạo profile"}
                </Button>
              )}

              {account.profile && (
                <Button
                  variant="outline"
                  onClick={() => setEditProfileOpen(true)}
                  disabled={isUpdatingProfile}
                >
                  <Pencil className="size-4" />
                  {isUpdatingProfile ? "Đang lưu..." : "Cập nhật profile"}
                </Button>
              )}
            </div>
          )}

          {account && (
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 px-4 text-sm">
              <dt className="text-muted-foreground font-medium">
                Mã tài khoản
              </dt>
              <dd>{account.accountId}</dd>

              <dt className="text-muted-foreground font-medium">
                Tên đăng nhập
              </dt>
              <dd>{account.username}</dd>

              <dt className="text-muted-foreground font-medium">Vai trò</dt>
              <dd>{ACCOUNT_ROLE_LABELS[account.role] ?? account.role}</dd>

              <dt className="text-muted-foreground font-medium">Họ và tên</dt>
              <dd>{account.profile?.fullName ?? account.username ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd>{account.email ?? account.profile?.email ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">
                Trạng thái hồ sơ
              </dt>
              <dd>{account.profile?.status ?? "—"}</dd>
            </dl>
          )}
        </SheetContent>
      </Sheet>

      <ProfileFormDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        profile={profileDetail ?? null}
        onSubmit={handleSubmitUpdateProfile}
        isSubmitting={isUpdatingProfile}
        title={`Cập nhật profile — ${account?.username ?? ""}`}
      />
    </>
  );
}
