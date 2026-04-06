"use client";

import * as React from "react";
import { PageContainer } from "@/components/page-container";
import { PageSectionHeader } from "@/components/page-section-header";
import {
  useParentMyStudents,
  useParentStudentAttendance,
  useParentStudentSchedule,
} from "@/hooks/use-parent-access";
import { useAuthStore } from "@/stores/auth-store";

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
      {message}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="text-muted-foreground text-sm">Đang tải dữ liệu...</div>
  );
}

export function ParentStudentCenter() {
  const role = useAuthStore((s) => s.currentUser?.role ?? null);

  const [dayOfWeek, setDayOfWeek] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const {
    data: studentData,
    isLoading: studentsLoading,
    error: studentsError,
  } = useParentMyStudents({ page: 1, limit: 100 });

  const [selectedStudentId, setSelectedStudentId] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    if (!studentData?.items?.length) return;
    if (!selectedStudentId) {
      setSelectedStudentId(studentData.items[0].profileId);
      return;
    }
    const stillExists = studentData.items.some(
      (student) => student.profileId === selectedStudentId,
    );
    if (!stillExists) {
      setSelectedStudentId(studentData.items[0].profileId);
    }
  }, [selectedStudentId, studentData?.items]);

  const {
    data: scheduleData,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useParentStudentSchedule(selectedStudentId, {
    ...(dayOfWeek ? { dayOfWeek } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  });

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useParentStudentAttendance(selectedStudentId, {
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
  });

  const selectedStudent = React.useMemo(
    () =>
      studentData?.items.find(
        (student) => student.profileId === selectedStudentId,
      ) ?? null,
    [selectedStudentId, studentData?.items],
  );

  if (role && role !== "PARENT") {
    return (
      <PageContainer
        header={
          <PageSectionHeader
            title="Con của tôi"
            description="Chức năng này chỉ dành cho tài khoản phụ huynh."
          />
        }
      >
        <EmptyState message="Bạn không có quyền truy cập trang này." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={
        <PageSectionHeader
          title="Con của tôi"
          description="Xem danh sách học sinh đã liên kết, lịch học và điểm danh theo từng học sinh."
        />
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Học sinh</label>
            <select
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              value={selectedStudentId ?? ""}
              onChange={(e) => {
                const next = Number(e.target.value);
                setSelectedStudentId(Number.isNaN(next) ? undefined : next);
              }}
              disabled={studentsLoading || !studentData?.items?.length}
            >
              {studentData?.items?.length ? (
                studentData.items.map((student) => (
                  <option key={student.profileId} value={student.profileId}>
                    {student.fullName ?? `#${student.profileId}`} (ID:{" "}
                    {student.profileId})
                  </option>
                ))
              ) : (
                <option value="">Không có học sinh liên kết</option>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Thứ</label>
            <select
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="MONDAY">Thứ 2</option>
              <option value="TUESDAY">Thứ 3</option>
              <option value="WEDNESDAY">Thứ 4</option>
              <option value="THURSDAY">Thứ 5</option>
              <option value="FRIDAY">Thứ 6</option>
              <option value="SATURDAY">Thứ 7</option>
              <option value="SUNDAY">Chủ nhật</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Từ ngày</label>
            <input
              type="date"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Đến ngày</label>
            <input
              type="date"
              className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {studentsError ? (
          <EmptyState message={studentsError.message} />
        ) : studentsLoading ? (
          <LoadingBlock />
        ) : !studentData?.items?.length ? (
          <EmptyState message="Hiện chưa có học sinh nào được liên kết với tài khoản phụ huynh này." />
        ) : (
          <div className="text-sm">
            <span className="font-medium">Đang xem:</span>{" "}
            {selectedStudent?.fullName ?? "-"} (ID:{" "}
            {selectedStudent?.profileId ?? "-"})
          </div>
        )}

        <section className="space-y-2 rounded-lg border p-4">
          <h2 className="text-base font-semibold">Lịch học</h2>
          {schedulesError ? (
            <EmptyState message={schedulesError.message} />
          ) : schedulesLoading ? (
            <LoadingBlock />
          ) : !scheduleData?.length ? (
            <EmptyState message="Không có lịch học phù hợp với bộ lọc hiện tại." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-2 py-2">Môn học</th>
                    <th className="px-2 py-2">Lớp</th>
                    <th className="px-2 py-2">Phòng</th>
                    <th className="px-2 py-2">Thứ</th>
                    <th className="px-2 py-2">Tiết</th>
                    <th className="px-2 py-2">Khoảng ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row) => (
                    <tr key={row.scheduleId} className="border-b last:border-0">
                      <td className="px-2 py-2">{row.subjectName}</td>
                      <td className="px-2 py-2">{row.sectionName}</td>
                      <td className="px-2 py-2">{row.roomName}</td>
                      <td className="px-2 py-2">{row.dayOfWeek}</td>
                      <td className="px-2 py-2">
                        {row.startPeriod} - {row.endPeriod}
                      </td>
                      <td className="px-2 py-2">
                        {row.startDate} đến {row.endDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-lg border p-4">
          <h2 className="text-base font-semibold">Điểm danh</h2>
          {attendanceError ? (
            <EmptyState message={attendanceError.message} />
          ) : attendanceLoading ? (
            <LoadingBlock />
          ) : !attendanceData?.length ? (
            <EmptyState message="Không có dữ liệu điểm danh phù hợp với bộ lọc hiện tại." />
          ) : (
            attendanceData.map((subject) => (
              <div
                key={`${subject.subjectId}-${subject.sectionId}`}
                className="space-y-2"
              >
                <div className="text-sm font-medium">
                  {subject.subjectName} - {subject.sectionName}
                </div>
                {subject.attendanceSessions.length === 0 ? (
                  <EmptyState message="Môn này chưa có buổi điểm danh." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="px-2 py-2">Ngày</th>
                          <th className="px-2 py-2">Thứ</th>
                          <th className="px-2 py-2">Slot</th>
                          <th className="px-2 py-2">Phòng</th>
                          <th className="px-2 py-2">Tiết</th>
                          <th className="px-2 py-2">Trạng thái</th>
                          <th className="px-2 py-2">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subject.attendanceSessions.map((session) => (
                          <tr
                            key={session.attendanceId}
                            className="border-b last:border-0"
                          >
                            <td className="px-2 py-2">{session.date}</td>
                            <td className="px-2 py-2">{session.dayOfWeek}</td>
                            <td className="px-2 py-2">{session.slot}</td>
                            <td className="px-2 py-2">{session.roomName}</td>
                            <td className="px-2 py-2">
                              {session.startPeriod} - {session.endPeriod}
                            </td>
                            <td className="px-2 py-2">{session.status}</td>
                            <td className="px-2 py-2">{session.note || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </PageContainer>
  );
}
