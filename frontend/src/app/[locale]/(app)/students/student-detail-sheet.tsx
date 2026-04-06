"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProfileList } from "@/hooks/use-profiles";
import {
  useAssignParentToStudent,
  useStudentParents,
  useUnassignParentFromStudent,
} from "@/hooks/use-student-parents";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  STUDENT_GENDER_LABELS,
  STUDENT_STATUS_LABELS,
} from "./student.constants";
import type { Student } from "./student.types";

interface StudentDetailSheetProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDetailSheet({
  student,
  onClose,
}: StudentDetailSheetProps) {
  const [selectedParentId, setSelectedParentId] = React.useState("");
  const [unassigningParentId, setUnassigningParentId] = React.useState<
    number | null
  >(null);

  const studentProfileId = student?.profileId;

  const {
    data: studentParentsData,
    isLoading: isLoadingStudentParents,
    error: studentParentsError,
    mutate: refreshStudentParents,
  } = useStudentParents(studentProfileId, { page: 1, limit: 100 });

  const { data: parentProfilesData, isLoading: isLoadingParentProfiles } =
    useProfileList({ page: 1, limit: 100, role: "PARENT" });

  const { mutateWithResult: assignParent, isLoading: isAssigning } =
    useAssignParentToStudent();
  const { mutateWithResult: unassignParent, isLoading: isUnassigning } =
    useUnassignParentFromStudent();

  const assignedParents = studentParentsData?.items ?? [];
  const assignedParentIds = React.useMemo(
    () => new Set(assignedParents.map((item) => item.profileId)),
    [assignedParents],
  );

  const availableParentOptions = React.useMemo(
    () =>
      (parentProfilesData?.items ?? []).filter(
        (item) => !assignedParentIds.has(item.profileId),
      ),
    [assignedParentIds, parentProfilesData?.items],
  );

  React.useEffect(() => {
    if (!student) {
      setSelectedParentId("");
    }
  }, [student]);

  async function handleAssignParent() {
    if (!studentProfileId) {
      return;
    }

    const parentId = Number(selectedParentId);
    if (!Number.isInteger(parentId) || parentId <= 0) {
      toast.error("Vui lòng chọn phụ huynh cần gán.");
      return;
    }

    const result = await assignParent({
      studentId: studentProfileId,
      parentId,
    });

    if (!result.ok) {
      toast.error(result.error?.message ?? "Gán phụ huynh thất bại.");
      return;
    }

    toast.success(result.data?.message ?? "Gán phụ huynh thành công.");
    setSelectedParentId("");
    await refreshStudentParents();
  }

  async function handleUnassignParent(parentId: number) {
    if (!studentProfileId) {
      return;
    }

    setUnassigningParentId(parentId);
    const result = await unassignParent({
      studentId: studentProfileId,
      parentId,
    });
    setUnassigningParentId(null);

    if (!result.ok) {
      toast.error(result.error?.message ?? "Hủy gán phụ huynh thất bại.");
      return;
    }

    toast.success(result.data?.message ?? "Hủy gán phụ huynh thành công.");
    await refreshStudentParents();
  }

  return (
    <Sheet
      open={student !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            Chi tiết sinh viên — {student?.fullName ?? ""}
          </SheetTitle>
        </SheetHeader>

        {student && (
          <div className="space-y-6 px-4">
            <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted-foreground font-medium">Mã hồ sơ</dt>
              <dd>{student.profileId}</dd>

              <dt className="text-muted-foreground font-medium">
                Mã tài khoản
              </dt>
              <dd>{student.accountId}</dd>

              <dt className="text-muted-foreground font-medium">
                Tên đăng nhập
              </dt>
              <dd>{student.username}</dd>

              <dt className="text-muted-foreground font-medium">Họ và tên</dt>
              <dd>{student.fullName ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd>{student.email ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">
                Số điện thoại
              </dt>
              <dd>{student.phoneNumber ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Ngày sinh</dt>
              <dd>{student.dateOfBirth ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Giới tính</dt>
              <dd>
                {student.gender
                  ? (STUDENT_GENDER_LABELS[student.gender.toUpperCase()] ??
                    student.gender)
                  : "—"}
              </dd>

              <dt className="text-muted-foreground font-medium">Avatar</dt>
              <dd className="truncate">{student.avatar ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">CCCD/CMND</dt>
              <dd>{student.citizenId ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Quê quán</dt>
              <dd>{student.hometown ?? "—"}</dd>

              <dt className="text-muted-foreground font-medium">Trạng thái</dt>
              <dd>
                {student.status
                  ? (STUDENT_STATUS_LABELS[student.status.toUpperCase()] ??
                    student.status)
                  : "—"}
              </dd>
            </dl>

            <section className="space-y-3 border-t pt-4">
              <h3 className="text-sm font-semibold">Phụ huynh liên kết</h3>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  disabled={isAssigning || isLoadingParentProfiles}
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">— Chọn phụ huynh để gán —</option>
                  {availableParentOptions.map((parent) => (
                    <option key={parent.profileId} value={parent.profileId}>
                      {parent.fullName ?? `#P${parent.profileId}`}
                      {parent.email ? ` • ${parent.email}` : ""}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={handleAssignParent}
                  disabled={
                    isAssigning ||
                    isLoadingParentProfiles ||
                    !selectedParentId ||
                    !student
                  }
                >
                  {isAssigning ? "Đang gán..." : "Gán phụ huynh"}
                </Button>
              </div>

              {studentParentsError && (
                <p className="text-destructive text-sm">
                  {studentParentsError.message}
                </p>
              )}

              {isLoadingStudentParents ? (
                <p className="text-muted-foreground text-sm">
                  Đang tải dữ liệu...
                </p>
              ) : assignedParents.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Sinh viên chưa có phụ huynh được liên kết.
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedParents.map((parent) => (
                    <div
                      key={parent.profileId}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {parent.fullName ?? `#P${parent.profileId}`}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {parent.email ?? "Không có email"}
                          {parent.phoneNumber ? ` • ${parent.phoneNumber}` : ""}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={
                          isUnassigning &&
                          unassigningParentId === parent.profileId
                        }
                        onClick={() => handleUnassignParent(parent.profileId)}
                      >
                        {isUnassigning &&
                        unassigningParentId === parent.profileId
                          ? "Đang hủy..."
                          : "Hủy gán"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
