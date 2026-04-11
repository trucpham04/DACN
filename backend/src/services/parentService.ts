import { Prisma, RoleEnum } from "@prisma/client";
import { z } from "zod";
import { PARENT_ERROR_CODES } from "../constants/errors/parent/codes";
import {
  PARENT_ERROR_MESSAGES,
  PARENT_FIELD_ERROR_MESSAGES,
} from "../constants/errors/parent/messages";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const dayOfWeekValues = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type DayOfWeek = (typeof dayOfWeekValues)[number];

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

const requiredPositiveIntSchema = (
  requiredMessage: string,
  invalidMessage: string,
) =>
  z.coerce
    .number({
      error: (issue) =>
        issue.input === undefined ? requiredMessage : invalidMessage,
    })
    .int(invalidMessage)
    .positive(invalidMessage);

const pageSchema = z.coerce
  .number({
    error: PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER,
  })
  .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_INTEGER)
  .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_PAGE_INVALID_POSITIVE)
  .default(1);

const limitSchema = z.coerce
  .number({
    error: PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER,
  })
  .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_INTEGER)
  .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_POSITIVE)
  .max(100, PARENT_FIELD_ERROR_MESSAGES.QUERY_LIMIT_INVALID_MAX)
  .default(10);

const dateOnlySchema = (message: string) =>
  z.string({ error: message }).trim().regex(dateOnlyRegex, message);

const dayOfWeekSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
  z.enum(dayOfWeekValues, {
    error: PARENT_FIELD_ERROR_MESSAGES.QUERY_DAY_OF_WEEK_INVALID,
  }),
);

const formatDateOnly = (value: Date | null): string | null =>
  value ? value.toISOString().slice(0, 10) : null;

const formatDayOfWeek = (value: DayOfWeek): string =>
  `${value.charAt(0)}${value.slice(1).toLowerCase()}`;

const parseDateOnlyToUtc = (value: string): Date =>
  new Date(`${value}T00:00:00.000Z`);

const getDayOfWeekFromDate = (value: Date): DayOfWeek => {
  const dayByIndex: DayOfWeek[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return dayByIndex[value.getUTCDay()];
};

const buildScheduleDateRangeClauses = (
  startDate?: string,
  endDate?: string,
): Prisma.ScheduleWhereInput[] => {
  if (startDate && endDate) {
    const start = parseDateOnlyToUtc(startDate);
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        StartDate: {
          lte: end,
        },
      },
      {
        EndDate: {
          gte: start,
        },
      },
    ];
  }

  if (startDate) {
    const start = parseDateOnlyToUtc(startDate);
    return [
      {
        EndDate: {
          gte: start,
        },
      },
    ];
  }

  if (endDate) {
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        StartDate: {
          lte: end,
        },
      },
    ];
  }

  return [];
};

const buildAttendanceDateRangeClauses = (
  startDate?: string,
  endDate?: string,
): Prisma.AttendanceDetailWhereInput[] => {
  if (startDate && endDate) {
    const start = parseDateOnlyToUtc(startDate);
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        attendance: {
          is: {
            AttendanceDate: {
              gte: start,
            },
          },
        },
      },
      {
        attendance: {
          is: {
            AttendanceDate: {
              lte: end,
            },
          },
        },
      },
    ];
  }

  if (startDate) {
    const start = parseDateOnlyToUtc(startDate);
    return [
      {
        attendance: {
          is: {
            AttendanceDate: {
              gte: start,
            },
          },
        },
      },
    ];
  }

  if (endDate) {
    const end = parseDateOnlyToUtc(endDate);
    return [
      {
        attendance: {
          is: {
            AttendanceDate: {
              lte: end,
            },
          },
        },
      },
    ];
  }

  return [];
};

export const assignParentSchema = z.object({
  studentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_INVALID,
  ),
  parentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_INVALID,
  ),
});

export const unassignParentQuerySchema = z.object({
  studentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.STUDENT_ID_INVALID,
  ),
  parentId: requiredPositiveIntSchema(
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_REQUIRED,
    PARENT_FIELD_ERROR_MESSAGES.PARENT_ID_INVALID,
  ),
});

export const getStudentParentsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
});

export const getMyStudentsQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
});

export const getParentStudentScheduleQuerySchema = z
  .object({
    sectionId: z.coerce
      .number({
        error: PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
      })
      .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .optional(),
    roomId: z.coerce
      .number({
        error: PARENT_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID,
      })
      .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_ROOM_ID_INVALID)
      .optional(),
    dayOfWeek: dayOfWeekSchema.optional(),
    startDate: dateOnlySchema(PARENT_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID).optional(),
    endDate: dateOnlySchema(PARENT_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID).optional(),
  })
  .superRefine((input, ctx) => {
    if (input.startDate && input.endDate && input.endDate < input.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: PARENT_FIELD_ERROR_MESSAGES.QUERY_DATE_RANGE_INVALID,
      });
    }
  });

export const getParentStudentAttendanceQuerySchema = z
  .object({
    subjectId: z.coerce
      .number({
        error: PARENT_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID,
      })
      .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID)
      .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_SUBJECT_ID_INVALID)
      .optional(),
    sectionId: z.coerce
      .number({
        error: PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID,
      })
      .int(PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .positive(PARENT_FIELD_ERROR_MESSAGES.QUERY_SECTION_ID_INVALID)
      .optional(),
    startDate: dateOnlySchema(PARENT_FIELD_ERROR_MESSAGES.QUERY_START_DATE_INVALID).optional(),
    endDate: dateOnlySchema(PARENT_FIELD_ERROR_MESSAGES.QUERY_END_DATE_INVALID).optional(),
  })
  .superRefine((input, ctx) => {
    if (input.startDate && input.endDate && input.endDate < input.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: PARENT_FIELD_ERROR_MESSAGES.QUERY_DATE_RANGE_INVALID,
      });
    }
  });

type AssignParentInput = z.infer<typeof assignParentSchema>;
type UnassignParentQueryInput = z.infer<typeof unassignParentQuerySchema>;
type GetStudentParentsQueryInput = z.infer<typeof getStudentParentsQuerySchema>;
type GetMyStudentsQueryInput = z.infer<typeof getMyStudentsQuerySchema>;
type GetParentStudentScheduleQueryInput = z.infer<
  typeof getParentStudentScheduleQuerySchema
>;
type GetParentStudentAttendanceQueryInput = z.infer<
  typeof getParentStudentAttendanceQuerySchema
>;

const assertStudentProfileExists = async (
  studentId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const student = await prisma.userProfile.findFirst({
    where: {
      ProfileID: studentId,
      account: {
        is: {
          IsDeleted: false,
          Role: RoleEnum.STUDENT,
        },
      },
    },
    select: {
      ProfileID: true,
    },
  });

  if (!student) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

const assertParentProfileExists = async (
  parentId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const parent = await prisma.userProfile.findFirst({
    where: {
      ProfileID: parentId,
      account: {
        is: {
          IsDeleted: false,
          Role: RoleEnum.PARENT,
        },
      },
    },
    select: {
      ProfileID: true,
    },
  });

  if (!parent) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

const getParentProfileIdByAccount = async (
  accountId: number,
  options: { code: string; message: string },
): Promise<number> => {
  const parentProfile = await prisma.userProfile.findFirst({
    where: {
      AccountID: accountId,
      account: {
        is: {
          IsDeleted: false,
          Role: RoleEnum.PARENT,
        },
      },
    },
    select: {
      ProfileID: true,
    },
  });

  if (!parentProfile) {
    throw new AppError(options.message, {
      statusCode: 404,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }

  return parentProfile.ProfileID;
};

const assertStudentLinkedToParent = async (
  parentProfileId: number,
  studentId: number,
  options: { code: string; message: string },
): Promise<void> => {
  const link = await prisma.userParents.findFirst({
    where: {
      ParentID: parentProfileId,
      StudentID: studentId,
      student: {
        is: {
          account: {
            is: {
              IsDeleted: false,
              Role: RoleEnum.STUDENT,
            },
          },
        },
      },
    },
    select: {
      StudentID: true,
    },
  });

  if (!link) {
    throw new AppError(options.message, {
      statusCode: 403,
      code: options.code,
      details: businessErrorDetails(options.message),
    });
  }
};

export const assignParentToStudent = async (input: AssignParentInput) => {
  await Promise.all([
    assertStudentProfileExists(input.studentId, {
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
      message: PARENT_ERROR_MESSAGES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
    }),
    assertParentProfileExists(input.parentId, {
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
      message: PARENT_ERROR_MESSAGES.PARENT_ASSIGN_STUDENT_OR_PARENT_NOT_FOUND,
    }),
  ]);

  const existingLink = await prisma.userParents.findUnique({
    where: {
      StudentID_ParentID: {
        StudentID: input.studentId,
        ParentID: input.parentId,
      },
    },
    select: {
      StudentID: true,
    },
  });

  if (existingLink) {
    throw new AppError(PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED, {
      statusCode: 409,
      code: PARENT_ERROR_CODES.PARENT_ASSIGN_ALREADY_LINKED,
      details: businessErrorDetails(
        PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED,
      ),
    });
  }

  try {
    await prisma.userParents.create({
      data: {
        StudentID: input.studentId,
        ParentID: input.parentId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED, {
        statusCode: 409,
        code: PARENT_ERROR_CODES.PARENT_ASSIGN_ALREADY_LINKED,
        details: businessErrorDetails(
          PARENT_ERROR_MESSAGES.PARENT_ASSIGN_ALREADY_LINKED,
        ),
      });
    }

    throw error;
  }

  return {
    studentId: input.studentId,
    parentId: input.parentId,
  };
};

export const unassignParentFromStudent = async (
  input: UnassignParentQueryInput,
): Promise<void> => {
  const deleted = await prisma.userParents.deleteMany({
    where: {
      StudentID: input.studentId,
      ParentID: input.parentId,
    },
  });

  if (deleted.count === 0) {
    throw new AppError(PARENT_ERROR_MESSAGES.PARENT_UNASSIGN_LINK_NOT_FOUND, {
      statusCode: 404,
      code: PARENT_ERROR_CODES.PARENT_UNASSIGN_LINK_NOT_FOUND,
      details: businessErrorDetails(
        PARENT_ERROR_MESSAGES.PARENT_UNASSIGN_LINK_NOT_FOUND,
      ),
    });
  }
};

export const getParentsOfStudent = async (
  studentId: number,
  input: GetStudentParentsQueryInput,
) => {
  await assertStudentProfileExists(studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_PARENTS_STUDENT_NOT_FOUND,
  });

  const skip = (input.page - 1) * input.limit;
  const where: Prisma.UserParentsWhereInput = {
    StudentID: studentId,
    parent: {
      is: {
        account: {
          is: {
            IsDeleted: false,
            Role: RoleEnum.PARENT,
          },
        },
      },
    },
  };

  const [rows, total] = await Promise.all([
    prisma.userParents.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        ParentID: "asc",
      },
      select: {
        parent: {
          select: {
            ProfileID: true,
            FullName: true,
            PhoneNumber: true,
            DateOfBirth: true,
            Gender: true,
            Avatar: true,
            account: {
              select: {
                Email: true,
              },
            },
          },
        },
      },
    }),
    prisma.userParents.count({ where }),
  ]);

  return {
    parents: rows.map((row) => ({
      profileID: row.parent.ProfileID,
      fullName: row.parent.FullName,
      phoneNumber: row.parent.PhoneNumber,
      email: row.parent.account.Email,
      dateOfBirth: formatDateOnly(row.parent.DateOfBirth),
      gender: row.parent.Gender,
      avatar: row.parent.Avatar,
    })),
    total,
  };
};

export const getMyStudents = async (
  accountId: number,
  input: GetMyStudentsQueryInput,
) => {
  const parentProfileId = await getParentProfileIdByAccount(accountId, {
    code: PARENT_ERROR_CODES.PARENT_MY_STUDENTS_PARENT_PROFILE_NOT_FOUND,
    message: PARENT_ERROR_MESSAGES.PARENT_MY_STUDENTS_PARENT_PROFILE_NOT_FOUND,
  });

  const skip = (input.page - 1) * input.limit;
  const where: Prisma.UserParentsWhereInput = {
    ParentID: parentProfileId,
    student: {
      is: {
        account: {
          is: {
            IsDeleted: false,
            Role: RoleEnum.STUDENT,
          },
        },
      },
    },
  };

  const [rows, total] = await Promise.all([
    prisma.userParents.findMany({
      where,
      skip,
      take: input.limit,
      orderBy: {
        StudentID: "asc",
      },
      select: {
        student: {
          select: {
            ProfileID: true,
            FullName: true,
            PhoneNumber: true,
            DateOfBirth: true,
            Gender: true,
            Avatar: true,
            account: {
              select: {
                Email: true,
              },
            },
          },
        },
      },
    }),
    prisma.userParents.count({ where }),
  ]);

  return {
    students: rows.map((row) => ({
      profileID: row.student.ProfileID,
      fullName: row.student.FullName,
      phoneNumber: row.student.PhoneNumber,
      email: row.student.account.Email,
      dateOfBirth: formatDateOnly(row.student.DateOfBirth),
      gender: row.student.Gender,
      avatar: row.student.Avatar,
    })),
    total,
  };
};

export const getLinkedStudentScheduleForParent = async (
  accountId: number,
  studentId: number,
  input: GetParentStudentScheduleQueryInput,
) => {
  const parentProfileId = await getParentProfileIdByAccount(accountId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_SCHEDULE_PARENT_PROFILE_NOT_FOUND,
    message:
      PARENT_ERROR_MESSAGES.PARENT_STUDENT_SCHEDULE_PARENT_PROFILE_NOT_FOUND,
  });

  await assertStudentLinkedToParent(parentProfileId, studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_SCHEDULE_STUDENT_NOT_LINKED,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_SCHEDULE_STUDENT_NOT_LINKED,
  });

  const clauses: Prisma.ScheduleWhereInput[] = [
    {
      section: {
        is: {
          registrations: {
            some: {
              StudentProfileID: studentId,
            },
          },
        },
      },
    },
  ];

  if (input.sectionId !== undefined) {
    clauses.push({
      SectionID: input.sectionId,
    });
  }

  if (input.roomId !== undefined) {
    clauses.push({
      RoomID: input.roomId,
    });
  }

  if (input.dayOfWeek !== undefined) {
    clauses.push({
      DayOfWeek: input.dayOfWeek,
    });
  }

  clauses.push(...buildScheduleDateRangeClauses(input.startDate, input.endDate));

  const where: Prisma.ScheduleWhereInput =
    clauses.length === 1 ? clauses[0] : { AND: clauses };

  const schedules = await prisma.schedule.findMany({
    where,
    orderBy: [{ StartDate: "asc" }, { StartPeriod: "asc" }],
    select: {
      ScheduleID: true,
      RoomID: true,
      SectionID: true,
      DayOfWeek: true,
      StartPeriod: true,
      EndPeriod: true,
      TotalPeriods: true,
      StartDate: true,
      EndDate: true,
      room: {
        select: {
          RoomName: true,
        },
      },
      section: {
        select: {
          SubjectID: true,
          subject: {
            select: {
              SubjectName: true,
            },
          },
        },
      },
    },
  });

  return schedules.map((schedule) => ({
    scheduleId: schedule.ScheduleID,
    roomId: schedule.RoomID,
    roomName: schedule.room.RoomName,
    subjectId: schedule.section.SubjectID,
    subjectName: schedule.section.subject.SubjectName,
    sectionId: schedule.SectionID,
    sectionName: `${schedule.section.subject.SubjectName}-${schedule.SectionID}`,
    dayOfWeek: formatDayOfWeek(schedule.DayOfWeek as DayOfWeek),
    startPeriod: schedule.StartPeriod,
    endPeriod: schedule.EndPeriod,
    totalPeriods: schedule.TotalPeriods,
    startDate: formatDateOnly(schedule.StartDate),
    endDate: formatDateOnly(schedule.EndDate),
  }));
};

export const getLinkedStudentAttendanceForParent = async (
  accountId: number,
  studentId: number,
  input: GetParentStudentAttendanceQueryInput,
) => {
  const parentProfileId = await getParentProfileIdByAccount(accountId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_ATTENDANCE_PARENT_PROFILE_NOT_FOUND,
    message:
      PARENT_ERROR_MESSAGES.PARENT_STUDENT_ATTENDANCE_PARENT_PROFILE_NOT_FOUND,
  });

  await assertStudentLinkedToParent(parentProfileId, studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_ATTENDANCE_STUDENT_NOT_LINKED,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_ATTENDANCE_STUDENT_NOT_LINKED,
  });

  const clauses: Prisma.AttendanceDetailWhereInput[] = [
    {
      StudentProfileID: studentId,
    },
  ];

  if (input.sectionId !== undefined) {
    clauses.push({
      attendance: {
        is: {
          SectionID: input.sectionId,
        },
      },
    });
  }

  if (input.subjectId !== undefined) {
    clauses.push({
      attendance: {
        is: {
          section: {
            is: {
              SubjectID: input.subjectId,
            },
          },
        },
      },
    });
  }

  clauses.push(...buildAttendanceDateRangeClauses(input.startDate, input.endDate));

  const where: Prisma.AttendanceDetailWhereInput =
    clauses.length === 1 ? clauses[0] : { AND: clauses };

  const rows = await prisma.attendanceDetail.findMany({
    where,
    orderBy: [
      {
        attendance: {
          AttendanceDate: "asc",
        },
      },
      {
        attendance: {
          Slot: "asc",
        },
      },
      {
        AttendanceDetailID: "asc",
      },
    ],
    select: {
      Status: true,
      Note: true,
      attendance: {
        select: {
          AttendanceID: true,
          AttendanceDate: true,
          Slot: true,
          SectionID: true,
          section: {
            select: {
              SubjectID: true,
              subject: {
                select: {
                  SubjectName: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const sectionIds = Array.from(new Set(rows.map((row) => row.attendance.SectionID)));
  const schedulesBySection = new Map<
    number,
    Array<{
      DayOfWeek: DayOfWeek;
      StartDate: Date;
      EndDate: Date;
      StartPeriod: number;
      EndPeriod: number;
      RoomID: number;
      roomName: string;
    }>
  >();

  if (sectionIds.length > 0) {
    const schedules = await prisma.schedule.findMany({
      where: {
        SectionID: {
          in: sectionIds,
        },
      },
      orderBy: [{ StartDate: "asc" }, { StartPeriod: "asc" }],
      select: {
        SectionID: true,
        DayOfWeek: true,
        StartDate: true,
        EndDate: true,
        StartPeriod: true,
        EndPeriod: true,
        RoomID: true,
        room: {
          select: {
            RoomName: true,
          },
        },
      },
    });

    schedules.forEach((schedule) => {
      const list = schedulesBySection.get(schedule.SectionID) ?? [];
      list.push({
        DayOfWeek: schedule.DayOfWeek as DayOfWeek,
        StartDate: schedule.StartDate,
        EndDate: schedule.EndDate,
        StartPeriod: schedule.StartPeriod,
        EndPeriod: schedule.EndPeriod,
        RoomID: schedule.RoomID,
        roomName: schedule.room.RoomName,
      });
      schedulesBySection.set(schedule.SectionID, list);
    });
  }

  const grouped = new Map<
    string,
    {
      subjectId: number;
      subjectName: string;
      sectionId: number;
      sectionName: string;
      attendanceSessions: Array<{
        attendanceId: number;
        date: string | null;
        dayOfWeek: string;
        slot: number;
        roomId: number | null;
        roomName: string | null;
        startPeriod: number | null;
        endPeriod: number | null;
        status: string | null;
        note: string | null;
      }>;
    }
  >();

  rows.forEach((row) => {
    const attendanceDate = row.attendance.AttendanceDate;
    const dayOfWeekKey = getDayOfWeekFromDate(attendanceDate);
    const sectionSchedule = schedulesBySection.get(row.attendance.SectionID) ?? [];
    const matchedSchedule =
      sectionSchedule.find((schedule) => {
        const sameDay = schedule.DayOfWeek === dayOfWeekKey;
        const inDateRange =
          schedule.StartDate.getTime() <= attendanceDate.getTime() &&
          schedule.EndDate.getTime() >= attendanceDate.getTime();
        const inSlotRange =
          schedule.StartPeriod <= row.attendance.Slot &&
          schedule.EndPeriod >= row.attendance.Slot;
        return sameDay && inDateRange && inSlotRange;
      }) ??
      sectionSchedule.find((schedule) => {
        const sameDay = schedule.DayOfWeek === dayOfWeekKey;
        const inDateRange =
          schedule.StartDate.getTime() <= attendanceDate.getTime() &&
          schedule.EndDate.getTime() >= attendanceDate.getTime();
        return sameDay && inDateRange;
      }) ??
      null;

    const subjectId = row.attendance.section.SubjectID;
    const subjectName = row.attendance.section.subject.SubjectName;
    const sectionId = row.attendance.SectionID;
    const groupKey = `${subjectId}-${sectionId}`;

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        subjectId,
        subjectName,
        sectionId,
        sectionName: `${subjectName}-${sectionId}`,
        attendanceSessions: [],
      });
    }

    const targetGroup = grouped.get(groupKey);
    if (!targetGroup) {
      return;
    }

    targetGroup.attendanceSessions.push({
      attendanceId: row.attendance.AttendanceID,
      date: formatDateOnly(attendanceDate),
      dayOfWeek: formatDayOfWeek(dayOfWeekKey),
      slot: row.attendance.Slot,
      roomId: matchedSchedule?.RoomID ?? null,
      roomName: matchedSchedule?.roomName ?? null,
      startPeriod: matchedSchedule?.StartPeriod ?? null,
      endPeriod: matchedSchedule?.EndPeriod ?? null,
      status: row.Status,
      note: row.Note,
    });
  });

  return Array.from(grouped.values())
    .map((group) => ({
      ...group,
      attendanceSessions: group.attendanceSessions.sort((a, b) => {
        const dateCompare = (a.date ?? "").localeCompare(b.date ?? "");
        if (dateCompare !== 0) {
          return dateCompare;
        }
        return a.slot - b.slot;
      }),
    }))
    .sort((a, b) => {
      if (a.subjectId !== b.subjectId) {
        return a.subjectId - b.subjectId;
      }
      return a.sectionId - b.sectionId;
    });
};
