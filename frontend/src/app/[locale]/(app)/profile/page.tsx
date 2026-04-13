"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  useCreateProfile,
  useMyProfile,
  useUpdateMyProfile,
} from "@/hooks/use-profiles";
import { useAuthStore } from "@/stores/auth-store";
import type { MutationResult } from "@/types/api";
import type { Profile } from "@/types/profile";
import {
  PROFILE_GENDER_OPTIONS,
  PROFILE_STATUS_OPTIONS,
} from "./profile.constants";
import {
  buildUpdateProfilePayload,
  ProfileFormDialog,
  type ProfileFormValues,
} from "./profile-form-dialog";

function getGenderLabel(gender: string | null): string {
  const option = PROFILE_GENDER_OPTIONS.find((opt) => opt.value === gender);
  return option?.label ?? gender ?? "—";
}

function getStatusLabel(status: string | null): string {
  const option = PROFILE_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.label ?? status ?? "—";
}

function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN");
}

function extractApiErrorMessage(error: {
  message: string;
  details?: { fieldErrors?: Record<string, string[]> };
}): string {
  const fieldErrors = error.details?.fieldErrors;
  if (fieldErrors) {
    for (const messages of Object.values(fieldErrors)) {
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
      }
    }
  }
  return error.message;
}

export default function ProfilePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const currentUser = useAuthStore((state) => state.currentUser);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);

  const {
    data: profile,
    isLoading: isLoadingProfile,
    mutate: refreshProfile,
  } = useMyProfile();

  const { mutateWithResult: createProfileMut, isLoading: isCreatingProfile } =
    useCreateProfile();

  const { mutateWithResult: updateMyProfileMut, isLoading: isUpdating } =
    useUpdateMyProfile();

  const handleCreateProfile = async () => {
    if (!currentUser) {
      toast.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    const result = await createProfileMut({
      accountId: currentUser.accountId,
      fullName: currentUser.profile?.fullName ?? currentUser.username,
    });

    if (!result.ok) {
      toast.error(result.error?.message ?? "Tạo profile thất bại.");
      return;
    }

    toast.success("Tạo profile thành công.");
    await refreshProfile();
  };

  const handleProfileSubmit = async (
    values: ProfileFormValues,
  ): Promise<MutationResult<Profile>> => {
    const payload = buildUpdateProfilePayload(values, { profile });
    const result = await updateMyProfileMut(payload);
    if (result.ok && result.data) {
      const updatedProfile = result.data;

      updateCurrentUser((user) => ({
        ...user,
        profile: {
          profileId: updatedProfile.profileId,
          fullName: updatedProfile.fullName,
          email: updatedProfile.email,
          avatar: updatedProfile.avatar,
          status: updatedProfile.status,
        },
      }));

      toast.success("Cập nhật thông tin thành công.");
      setDialogOpen(false);
    } else {
      toast.error(
        (result.error ? extractApiErrorMessage(result.error) : undefined) ??
          "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      );
    }
    return result;
  };

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <div className="bg-muted/50 flex min-h-[50vh] items-center justify-center rounded-xl">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <div className="bg-muted/50 rounded-xl p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Tài khoản của bạn chưa có profile.
          </p>
          <Button
            onClick={() => {
              void handleCreateProfile();
            }}
            disabled={isCreatingProfile}
          >
            {isCreatingProfile ? "Đang tạo..." : "Tạo profile"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thông tin tài khoản
        </h1>
        <Button onClick={() => setDialogOpen(true)}>Chỉnh sửa</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Thông tin cá nhân */}
        <div className="border-input bg-muted/30 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Thông tin cá nhân</h3>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Họ và tên
              </p>
              <p className="text-sm">{profile.fullName ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">Email</p>
              <p className="text-sm">{profile.email ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Giới tính
              </p>
              <p className="text-sm">{getGenderLabel(profile.gender)}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Ngày sinh
              </p>
              <p className="text-sm">{formatDate(profile.dateOfBirth)}</p>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="border-input bg-muted/30 rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Thông tin liên hệ</h3>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Số điện thoại
              </p>
              <p className="text-sm">{profile.phoneNumber ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Quê quán
              </p>
              <p className="text-sm">{profile.hometown ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Số CMND/CCCD
              </p>
              <p className="text-sm">{profile.citizenId ?? "—"}</p>
            </div>
            <div className="grid gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                Trạng thái
              </p>
              <p className="text-sm">{getStatusLabel(profile.status)}</p>
            </div>
          </div>
        </div>

        {/* Ảnh đại diện */}
        {profile.avatar && (
          <div className="border-input bg-muted/30 rounded-lg border p-4 md:col-span-2">
            <h3 className="mb-4 font-semibold">Ảnh đại diện</h3>
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-auto max-w-xs rounded-lg"
            />
          </div>
        )}
      </div>

      <ProfileFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={profile}
        onSubmit={handleProfileSubmit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
