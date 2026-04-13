"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCertificateTypeList } from "@/hooks/use-certificate-types";
import {
  useCertificatesByApplication,
  useCreateCertificate,
  useDeleteCertificate,
} from "@/hooks/use-certificates";
import {
  useApplicationDetail,
  useMyApplications,
  useSubmitApplication,
  useUpdateApplicationMutation,
} from "@/hooks/use-profile-applications";
import { normalizePaginatedProfileApplications } from "@/lib/profile-application-dto";
import {
  getProfileApplicationsAccessMessage,
  shouldRedirectProfileApplications,
} from "@/lib/profile-applications-access";
import { useAuthStore } from "@/stores/auth-store";
import type { CertificateDetail } from "@/types/certificate";
import type {
  ProfileApplication,
  ProfileApplicationDetailModel,
} from "@/types/profile-application";
import { formatApplicationStatus } from "../approvals/application-status";

function CertificateDeleteButton({
  certificateId,
  onDeleted,
  disabled,
}: {
  certificateId: number;
  onDeleted: () => Promise<void>;
  disabled?: boolean;
}) {
  const { mutateWithResult: del, isLoading } =
    useDeleteCertificate(certificateId);

  async function handleDelete() {
    const result = await del(undefined);
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể xóa chứng chỉ.");
      return;
    }
    toast.success("Đã xóa chứng chỉ khỏi hồ sơ.");
    await onDeleted();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={disabled || isLoading}
        >
          Xóa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa chứng chỉ?</AlertDialogTitle>
          <AlertDialogDescription>
            Chứng chỉ sẽ bị gỡ khỏi hồ sơ. Bạn có chắc chắn?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => void handleDelete()}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function formatDateShort(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return iso;
  }
}

function sortApplicationsNewestFirst(apps: ProfileApplication[]) {
  return [...apps].sort((a, b) => {
    const ta = a.submissionDate ? new Date(a.submissionDate).getTime() : 0;
    const tb = b.submissionDate ? new Date(b.submissionDate).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return b.applicationId - a.applicationId;
  });
}

/** Read-only certificate list; treats API 404 / errors as empty (no red error state). */
function ApplicationDetailCertificates({
  applicationId,
}: {
  applicationId: number;
}) {
  const { data, isLoading, error } =
    useCertificatesByApplication(applicationId);
  const rows = error ? [] : (data ?? []);
  const showLoading = isLoading && !error;

  if (showLoading) {
    return <p className="text-muted-foreground text-sm">Đang tải chứng chỉ…</p>;
  }

  if (!rows.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Không có chứng chỉ đính kèm.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại</TableHead>
            <TableHead className="text-center">Điểm</TableHead>
            <TableHead>Cấp</TableHead>
            <TableHead>Hết hạn</TableHead>
            <TableHead>Minh chứng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c: CertificateDetail) => (
            <TableRow key={c.certificateId}>
              <TableCell>{c.typeName ?? `#${c.certificateTypeId}`}</TableCell>
              <TableCell className="text-center">{c.score ?? "—"}</TableCell>
              <TableCell>{formatDateShort(c.issueDate)}</TableCell>
              <TableCell>{formatDateShort(c.expiryDate)}</TableCell>
              <TableCell className="max-w-[160px] truncate">
                {c.evidenceURL ? (
                  <a
                    href={c.evidenceURL}
                    className="text-primary underline-offset-2 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Liên kết
                  </a>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProfileApplicationsForm() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = currentUser?.role ?? null;

  const accessMessage = getProfileApplicationsAccessMessage(role);
  const _redirect = shouldRedirectProfileApplications(role);
  void _redirect;

  const {
    data: myApps,
    isLoading: appsLoading,
    error: appsError,
    mutate: refreshMyApps,
  } = useMyApplications({ page: 1, limit: 50 });

  const items = React.useMemo(
    () => normalizePaginatedProfileApplications(myApps).items,
    [myApps],
  );

  const sortedItems = React.useMemo(
    () => sortApplicationsNewestFirst(items),
    [items],
  );

  const pendingApp =
    items.find((a) => a.applicationStatus === "PENDING") ?? null;

  const {
    data: typesData,
    isLoading: typesLoading,
    error: typesError,
  } = useCertificateTypeList({
    page: 1,
    limit: 100,
  });
  const typeOptions = typesData?.items ?? [];

  const {
    data: certificates,
    isLoading: certsLoading,
    mutate: refreshCertificates,
  } = useCertificatesByApplication(pendingApp?.applicationId);

  const { mutateWithResult: submitApp, isLoading: submitting } =
    useSubmitApplication();
  const { mutateWithResult: updateApp, isLoading: updating } =
    useUpdateApplicationMutation();
  const { mutateWithResult: createCert, isLoading: creatingCert } =
    useCreateCertificate();

  const [workspaceOpen, setWorkspaceOpen] = React.useState(false);
  const [detailApplicationId, setDetailApplicationId] = React.useState<
    number | null
  >(null);

  const [formTypeId, setFormTypeId] = React.useState<string>("");
  const [formScore, setFormScore] = React.useState("");
  const [formIssue, setFormIssue] = React.useState("");
  const [formExpiry, setFormExpiry] = React.useState("");
  const [formUrl, setFormUrl] = React.useState("");

  const canEditCertificates = pendingApp?.applicationStatus === "PENDING";

  const selectedDetailApp = React.useMemo(
    () =>
      detailApplicationId === null
        ? null
        : (items.find((a) => a.applicationId === detailApplicationId) ?? null),
    [items, detailApplicationId],
  );

  const { data: detailData, isLoading: detailLoading } = useApplicationDetail(
    detailApplicationId === null ? undefined : detailApplicationId,
  );

  const sheetApplication =
    React.useMemo((): ProfileApplicationDetailModel | null => {
      if (detailApplicationId === null) return null;
      if (detailData) return detailData;
      if (detailLoading) return null;
      if (selectedDetailApp) {
        return {
          ...selectedDetailApp,
          reviewedByFullName: null,
          certificatesCount: undefined,
        };
      }
      return null;
    }, [detailApplicationId, detailData, detailLoading, selectedDetailApp]);

  async function submitNewApplication(): Promise<boolean> {
    const result = await submitApp(undefined);
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể nộp hồ sơ.");
      return false;
    }
    toast.success("Đã nộp hồ sơ. Bạn có thể thêm chứng chỉ đính kèm.");
    await refreshMyApps();
    return true;
  }

  async function handleCtaClick() {
    if (pendingApp) {
      setWorkspaceOpen(true);
      return;
    }
    const ok = await submitNewApplication();
    if (ok) setWorkspaceOpen(true);
  }

  async function handleSubmitNewApplication() {
    const ok = await submitNewApplication();
    if (ok) setWorkspaceOpen(true);
  }

  async function handleUpdateApplication() {
    if (!pendingApp) return;
    const result = await updateApp({ applicationId: pendingApp.applicationId });
    if (!result.ok) {
      toast.error(result.error?.message ?? "Không thể cập nhật hồ sơ.");
      return;
    }
    toast.success("Đã cập nhật hồ sơ.");
    await refreshMyApps();
    await refreshCertificates();
  }

  async function handleAddCertificate(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingApp) return;
    const certificateTypeId = Number(formTypeId);
    if (!Number.isFinite(certificateTypeId) || certificateTypeId <= 0) {
      toast.error("Chọn loại chứng chỉ.");
      return;
    }

    const score = formScore.trim() === "" ? undefined : Number(formScore);
    if (formScore.trim() !== "" && !Number.isFinite(score)) {
      toast.error("Điểm không hợp lệ.");
      return;
    }

    const result = await createCert({
      applicationId: pendingApp.applicationId,
      certificateTypeId,
      score,
      issueDate: formIssue.trim() || undefined,
      expiryDate: formExpiry.trim() || undefined,
      evidenceURL: formUrl.trim() || undefined,
    });

    if (!result.ok) {
      toast.error(
        result.error?.message ??
          "Không thể thêm chứng chỉ. Kiểm tra quyền tài khoản hoặc dữ liệu.",
      );
      return;
    }

    toast.success("Đã thêm chứng chỉ vào hồ sơ.");
    setFormTypeId("");
    setFormScore("");
    setFormIssue("");
    setFormExpiry("");
    setFormUrl("");
    await refreshCertificates();
    await refreshMyApps();
  }

  const ctaDisabled =
    !!accessMessage || appsLoading || !!appsError || submitting;
  const ctaTitle = pendingApp ? "Hồ sơ đang chờ duyệt" : "Nộp hồ sơ mới";

  return (
    <div className="flex flex-col gap-8">
      {accessMessage ? (
        <div className="bg-muted rounded-lg border px-4 py-3 text-sm">
          {accessMessage}
        </div>
      ) : null}

      <section className="space-y-3">
        <button
          type="button"
          disabled={ctaDisabled}
          onClick={() => void handleCtaClick()}
          className="focus-visible:ring-ring bg-muted/20 hover:bg-muted/40 flex w-full flex-col items-stretch gap-1 rounded-md border border-dashed px-4 py-5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="text-lg font-semibold">{ctaTitle}</span>
          <span className="text-muted-foreground text-sm">
            {pendingApp
              ? "Nhấn để mở hộp thoại"
              : submitting
                ? "Đang nộp hồ sơ…"
                : "Nhấn để nộp hồ sơ và thêm chứng chỉ"}
          </span>
        </button>
        {appsLoading ? (
          <p className="text-muted-foreground mt-3 text-sm">Đang tải…</p>
        ) : appsError ? (
          <p className="text-destructive mt-3 text-sm">{appsError.message}</p>
        ) : null}
      </section>

      <Dialog open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
        <DialogContent
          className="max-h-[min(90vh,720px)] gap-0 overflow-y-auto sm:max-w-3xl"
          showCloseButton
        >
          <DialogHeader className="pb-4">
            <DialogTitle>
              {pendingApp ? "Chỉnh sửa hồ sơ" : "Nộp hồ sơ mới"}
            </DialogTitle>
            <DialogDescription>
              {pendingApp
                ? "Cập nhật thông tin và chứng chỉ đính kèm trước khi gửi duyệt."
                : "Tạo hồ sơ mới, sau đó bạn có thể thêm chứng chỉ trong cùng hộp thoại này."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 pb-2">
            {appsLoading ? (
              <p className="text-muted-foreground text-sm">Đang tải…</p>
            ) : appsError ? (
              <p className="text-destructive text-sm">{appsError.message}</p>
            ) : pendingApp ? (
              <>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Mã hồ sơ: </span>
                    <span className="font-medium">
                      {pendingApp.applicationId}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Trạng thái: </span>
                    {formatApplicationStatus(pendingApp.applicationStatus)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Ngày nộp: </span>
                    {formatDateShort(pendingApp.submissionDate)}
                  </p>
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={updating}
                      onClick={() => void handleUpdateApplication()}
                    >
                      {updating ? "Đang lưu…" : "Cập nhật hồ sơ (lưu thay đổi)"}
                    </Button>
                  </div>
                </div>

                {canEditCertificates ? (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-base font-semibold">
                      Chứng chỉ đính kèm
                    </h3>
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-center">Điểm</TableHead>
                            <TableHead>Cấp</TableHead>
                            <TableHead>Hết hạn</TableHead>
                            <TableHead>Minh chứng</TableHead>
                            <TableHead className="text-center">
                              Thao tác
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {certsLoading ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="h-20 text-center text-sm"
                              >
                                Đang tải chứng chỉ…
                              </TableCell>
                            </TableRow>
                          ) : !certificates?.length ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="text-muted-foreground h-20 text-center text-sm"
                              >
                                Chưa có chứng chỉ nào. Thêm mới bằng biểu mẫu
                                bên dưới.
                              </TableCell>
                            </TableRow>
                          ) : (
                            certificates.map((c: CertificateDetail) => (
                              <TableRow key={c.certificateId}>
                                <TableCell>
                                  {c.typeName ?? `#${c.certificateTypeId}`}
                                </TableCell>
                                <TableCell className="text-center">
                                  {c.score ?? "—"}
                                </TableCell>
                                <TableCell>
                                  {formatDateShort(c.issueDate)}
                                </TableCell>
                                <TableCell>
                                  {formatDateShort(c.expiryDate)}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {c.evidenceURL ? (
                                    <a
                                      href={c.evidenceURL}
                                      className="text-primary underline-offset-2 hover:underline"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Liên kết
                                    </a>
                                  ) : (
                                    "—"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-center">
                                    <CertificateDeleteButton
                                      certificateId={c.certificateId}
                                      onDeleted={async () => {
                                        await refreshCertificates();
                                      }}
                                      disabled={!canEditCertificates}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <form
                      onSubmit={(e) => void handleAddCertificate(e)}
                      className="bg-muted/30 grid gap-4 rounded-md border p-4 sm:grid-cols-2"
                    >
                      <div className="grid gap-1.5 sm:col-span-2">
                        <Label htmlFor="workspace-certType">
                          Loại chứng chỉ
                        </Label>
                        <select
                          id="workspace-certType"
                          className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                          value={formTypeId}
                          onChange={(e) => setFormTypeId(e.target.value)}
                          disabled={creatingCert || typesLoading || !!typesError}
                          required
                        >
                          <option value="">
                            {typesLoading
                              ? "Đang tải loại chứng chỉ…"
                              : typesError
                                ? "Không tải được loại chứng chỉ"
                                : "— Chọn —"}
                          </option>
                          {typeOptions.map((t) => (
                            <option
                              key={t.certificateTypeId}
                              value={String(t.certificateTypeId)}
                            >
                              {t.typeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="workspace-certScore">
                          Điểm (tuỳ chọn)
                        </Label>
                        <Input
                          id="workspace-certScore"
                          type="number"
                          step="any"
                          value={formScore}
                          onChange={(e) => setFormScore(e.target.value)}
                          disabled={creatingCert}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="workspace-certIssue">Ngày cấp</Label>
                        <Input
                          id="workspace-certIssue"
                          type="date"
                          value={formIssue}
                          onChange={(e) => setFormIssue(e.target.value)}
                          disabled={creatingCert}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="workspace-certExpiry">
                          Ngày hết hạn
                        </Label>
                        <Input
                          id="workspace-certExpiry"
                          type="date"
                          value={formExpiry}
                          onChange={(e) => setFormExpiry(e.target.value)}
                          disabled={creatingCert}
                        />
                      </div>
                      <div className="grid gap-1.5 sm:col-span-2">
                        <Label htmlFor="workspace-certUrl">
                          URL minh chứng (tuỳ chọn)
                        </Label>
                        <Input
                          id="workspace-certUrl"
                          type="url"
                          placeholder="https://..."
                          value={formUrl}
                          onChange={(e) => setFormUrl(e.target.value)}
                          disabled={creatingCert}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Button type="submit" disabled={creatingCert}>
                          {creatingCert ? "Đang thêm…" : "Thêm chứng chỉ"}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="grid gap-3">
                <p className="text-muted-foreground text-sm">
                  {submitting
                    ? "Đang tạo hồ sơ…"
                    : "Không tìm thấy hồ sơ đang chờ. Đóng và thử lại, hoặc nộp hồ sơ mới."}
                </p>
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleSubmitNewApplication()}
                >
                  {submitting ? "Đang nộp…" : "Nộp hồ sơ"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Lịch sử</h2>
        {sortedItems.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có hồ sơ.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {sortedItems.map((app) => (
              <li key={app.applicationId} className="last:border-b-0">
                <button
                  type="button"
                  onClick={() => setDetailApplicationId(app.applicationId)}
                  className="hover:bg-muted/50 focus-visible:ring-ring flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="text-foreground font-medium">
                    #{app.applicationId} —{" "}
                    {formatApplicationStatus(app.applicationStatus)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Nộp: {formatDateShort(app.submissionDate)}
                    {app.reviewDate
                      ? ` · Duyệt: ${formatDateShort(app.reviewDate)}`
                      : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Sheet
        open={detailApplicationId !== null}
        onOpenChange={(open) => {
          if (!open) setDetailApplicationId(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-2xl"
        >
          {detailApplicationId !== null && detailLoading ? (
            <p className="text-muted-foreground px-4 pt-2 text-sm">
              Đang tải chi tiết hồ sơ…
            </p>
          ) : sheetApplication ? (
            <>
              <SheetHeader>
                <SheetTitle>Hồ sơ #{sheetApplication.applicationId}</SheetTitle>
                <SheetDescription>
                  {formatApplicationStatus(sheetApplication.applicationStatus)}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 px-4 pb-4 text-sm">
                <div className="grid gap-2">
                  {sheetApplication.studentName ? (
                    <p>
                      <span className="text-muted-foreground">Sinh viên: </span>
                      {sheetApplication.studentName}
                    </p>
                  ) : null}
                  <p>
                    <span className="text-muted-foreground">Ngày nộp: </span>
                    {formatDateShort(sheetApplication.submissionDate)}
                  </p>
                  {sheetApplication.certificatesCount != null ? (
                    <p>
                      <span className="text-muted-foreground">
                        Số chứng chỉ:{" "}
                      </span>
                      {sheetApplication.certificatesCount}
                    </p>
                  ) : null}
                  {sheetApplication.reviewDate ? (
                    <p>
                      <span className="text-muted-foreground">
                        Ngày duyệt:{" "}
                      </span>
                      {formatDateShort(sheetApplication.reviewDate)}
                    </p>
                  ) : null}
                  {sheetApplication.reviewedByFullName ? (
                    <p>
                      <span className="text-muted-foreground">
                        Người duyệt:{" "}
                      </span>
                      {sheetApplication.reviewedByFullName}
                    </p>
                  ) : null}
                  {sheetApplication.reviewNotes ? (
                    <div className="grid gap-1">
                      <span className="text-muted-foreground">
                        Ghi chú duyệt
                      </span>
                      <p className="bg-muted/50 text-foreground rounded-md border p-3">
                        {sheetApplication.reviewNotes}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Chứng chỉ đính kèm</h3>
                  <ApplicationDetailCertificates
                    applicationId={sheetApplication.applicationId}
                  />
                </div>
              </div>
            </>
          ) : detailApplicationId !== null ? (
            <SheetHeader>
              <SheetTitle>Không tìm thấy hồ sơ</SheetTitle>
            </SheetHeader>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
