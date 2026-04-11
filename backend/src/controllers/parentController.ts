import { Request, Response } from "express";
import { AUTH_ERROR_CODES } from "../constants/errors/auth/codes";
import { AUTH_ERROR_MESSAGES } from "../constants/errors/auth/messages";
import { PARENT_ERROR_CODES } from "../constants/errors/parent/codes";
import {
  PARENT_ERROR_MESSAGES,
  PARENT_FIELD_ERROR_MESSAGES,
  PARENT_SUCCESS_MESSAGES,
} from "../constants/errors/parent/messages";
import { AppError } from "../middleware/errorHandler";
import {
  assignParentSchema,
  assignParentToStudent,
  getLinkedStudentAttendanceForParent,
  getLinkedStudentScheduleForParent,
  getMyStudents,
  getMyStudentsQuerySchema,
  getParentStudentAttendanceQuerySchema,
  getParentStudentScheduleQuerySchema,
  getParentsOfStudent,
  getStudentParentsQuerySchema,
  unassignParentFromStudent,
  unassignParentQuerySchema,
} from "../services/parentService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";

const requireUser = (req: Request): { accountId: number } => {
  if (!req.user) {
    throw new AppError(AUTH_ERROR_MESSAGES.LOGIN_REQUIRED, {
      statusCode: 401,
      code: AUTH_ERROR_CODES.UNAUTHORIZED,
      details: {
        formErrors: [AUTH_ERROR_MESSAGES.LOGIN_REQUIRED],
        fieldErrors: {},
      },
    });
  }

  return {
    accountId: req.user.accountId,
  };
};

export const assignParentToStudentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = parseOrThrow(assignParentSchema, req.body, {
    code: PARENT_ERROR_CODES.PARENT_ASSIGN_INVALID_INPUT,
    message: PARENT_ERROR_MESSAGES.PARENT_ASSIGN_INVALID_INPUT,
  });

  const result = await assignParentToStudent(payload);
  sendSuccess(
    res,
    {
      message: PARENT_SUCCESS_MESSAGES.PARENT_ASSIGN_SUCCESS,
      ...result,
    },
    201,
  );
};

export const unassignParentFromStudentHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(unassignParentQuerySchema, req.query, {
    code: PARENT_ERROR_CODES.PARENT_UNASSIGN_INVALID_QUERY,
    message: PARENT_ERROR_MESSAGES.PARENT_UNASSIGN_INVALID_QUERY,
  });

  await unassignParentFromStudent(query);
  sendSuccess(
    res,
    { message: PARENT_SUCCESS_MESSAGES.PARENT_UNASSIGN_SUCCESS },
    200,
  );
};

export const getStudentParentsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const studentId = parsePositiveIntParamOrThrow(req.params.studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_PARENTS_INVALID_STUDENT_ID,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_PARENTS_INVALID_STUDENT_ID,
    fieldName: "studentId",
    fieldMessage: PARENT_FIELD_ERROR_MESSAGES.QUERY_STUDENT_ID_INVALID,
  });

  const query = parseOrThrow(getStudentParentsQuerySchema, req.query, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_PARENTS_INVALID_QUERY,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_PARENTS_INVALID_QUERY,
  });

  const result = await getParentsOfStudent(studentId, query);
  sendSuccess(res, result.parents, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const getMyStudentsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const query = parseOrThrow(getMyStudentsQuerySchema, req.query, {
    code: PARENT_ERROR_CODES.PARENT_MY_STUDENTS_INVALID_QUERY,
    message: PARENT_ERROR_MESSAGES.PARENT_MY_STUDENTS_INVALID_QUERY,
  });

  const user = requireUser(req);
  const result = await getMyStudents(user.accountId, query);
  sendSuccess(res, result.students, 200, {
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
};

export const getParentStudentScheduleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const studentId = parsePositiveIntParamOrThrow(req.params.studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_SCHEDULE_INVALID_STUDENT_ID,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_SCHEDULE_INVALID_STUDENT_ID,
    fieldName: "studentId",
    fieldMessage: PARENT_FIELD_ERROR_MESSAGES.QUERY_STUDENT_ID_INVALID,
  });

  const query = parseOrThrow(getParentStudentScheduleQuerySchema, req.query, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_SCHEDULE_INVALID_QUERY,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_SCHEDULE_INVALID_QUERY,
  });

  const user = requireUser(req);
  const schedules = await getLinkedStudentScheduleForParent(
    user.accountId,
    studentId,
    query,
  );
  sendSuccess(res, schedules, 200);
};

export const getParentStudentAttendanceHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const studentId = parsePositiveIntParamOrThrow(req.params.studentId, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_ATTENDANCE_INVALID_STUDENT_ID,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_ATTENDANCE_INVALID_STUDENT_ID,
    fieldName: "studentId",
    fieldMessage: PARENT_FIELD_ERROR_MESSAGES.QUERY_STUDENT_ID_INVALID,
  });

  const query = parseOrThrow(getParentStudentAttendanceQuerySchema, req.query, {
    code: PARENT_ERROR_CODES.PARENT_STUDENT_ATTENDANCE_INVALID_QUERY,
    message: PARENT_ERROR_MESSAGES.PARENT_STUDENT_ATTENDANCE_INVALID_QUERY,
  });

  const user = requireUser(req);
  const attendances = await getLinkedStudentAttendanceForParent(
    user.accountId,
    studentId,
    query,
  );
  sendSuccess(res, attendances, 200);
};
