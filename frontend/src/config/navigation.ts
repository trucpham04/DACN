import {
  BadgeCheck,
  Book,
  BookOpen,
  BookText,
  Building,
  Calendar,
  CalendarClock,
  ClipboardList,
  FileText,
  GraduationCap,
  History,
  Key,
  ListChecks,
  NotebookPen,
  Users,
} from "lucide-react";
import type { NavGroup } from "@/types/navigation";

/**
 * Full navigation config for EduMS.
 *
 * Each item maps to an existing API module.
 * `roles` metadata is set but not yet used to filter rendering —
 * call `filterNavGroups(navGroups, role)` when role-gating is enabled.
 *
 * Items with `todo: true` have no implemented page yet and should be
 * excluded from active release builds or handled with a placeholder route.
 */
export const navGroups: NavGroup[] = [
  {
    label: "Hồ sơ & Tài khoản",
    roles: ["ADMIN"],
    items: [
      {
        href: "/lecturers",
        label: "Giảng viên",
        icon: GraduationCap,
        roles: ["ADMIN"],
      },
      {
        href: "/students",
        label: "Sinh viên",
        icon: Users,
        roles: ["ADMIN"],
      },
      {
        href: "/accounts",
        label: "Tài khoản",
        icon: Key,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    label: "Đào tạo",
    items: [
      {
        href: "/subjects",
        label: "Môn học",
        icon: Book,
        roles: ["ADMIN"],
      },
      {
        href: "/sections",
        label: "Học phần",
        icon: BookOpen,
        roles: ["ADMIN", "LECTURER"],
      },
      {
        href: "/registrations",
        label: "Đăng ký học phần",
        icon: NotebookPen,
        roles: ["ADMIN", "STUDENT"],
      },
      {
        href: "/schedules",
        label: "Lịch học",
        icon: Calendar,
        roles: ["ADMIN", "LECTURER", "STUDENT"],
      },
    ],
  },
  {
    label: "Điểm danh",
    items: [
      {
        href: "/attendances",
        label: "Buổi điểm danh",
        icon: ClipboardList,
        roles: ["ADMIN", "LECTURER"],
      },
      {
        href: "/attendance-summary",
        label: "Tổng hợp điểm danh",
        icon: ListChecks,
        roles: ["ADMIN", "LECTURER", "STUDENT"],
      },
    ],
  },
  {
    label: "Cơ sở vật chất",
    roles: ["ADMIN"],
    items: [
      {
        href: "/rooms",
        label: "Phòng học",
        icon: Building,
        roles: ["ADMIN"],
      },
      {
        href: "/usage-histories",
        label: "Lịch sử sử dụng phòng",
        icon: History,
        roles: ["ADMIN"],
      },
      {
        href: "/schedules/calendar",
        label: "Lịch phòng học",
        icon: CalendarClock,
        roles: ["ADMIN"],
      },
    ],
  },
  {
    label: "Xét duyệt & Chứng chỉ",
    items: [
      {
        href: "/profile-applications",
        label: "Hồ sơ xét duyệt",
        icon: FileText,
        roles: ["ADMIN", "STUDENT"],
      },
      {
        href: "/certificate-types",
        label: "Loại chứng chỉ",
        icon: BookText,
        roles: ["ADMIN"],
      },
      {
        href: "/certificates",
        label: "Chứng chỉ",
        icon: BadgeCheck,
        roles: ["ADMIN", "STUDENT"],
      },
    ],
  },
];
