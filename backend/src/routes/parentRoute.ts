import { Router } from "express";
import {
  assignParentToStudentHandler,
  getMyStudentsHandler,
  getParentStudentAttendanceHandler,
  getParentStudentScheduleHandler,
  unassignParentFromStudentHandler,
} from "../controllers/parentController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// POST /api/parents/assign - Assign parent to student (ADMIN only)
router.post("/assign", requireAuth, requireRole("ADMIN"), assignParentToStudentHandler);

// DELETE /api/parents/assign - Unassign parent from student (ADMIN only)
router.delete(
  "/assign",
  requireAuth,
  requireRole("ADMIN"),
  unassignParentFromStudentHandler,
);

// GET /api/parents/my-students - Parent's own linked students (PARENT only)
router.get(
  "/my-students",
  requireAuth,
  requireRole("PARENT"),
  getMyStudentsHandler,
);

// GET /api/parents/students/:studentId/schedule - Parent views linked student schedule (PARENT only)
router.get(
  "/students/:studentId/schedule",
  requireAuth,
  requireRole("PARENT"),
  getParentStudentScheduleHandler,
);

// GET /api/parents/students/:studentId/attendance - Parent views linked student attendance (PARENT only)
router.get(
  "/students/:studentId/attendance",
  requireAuth,
  requireRole("PARENT"),
  getParentStudentAttendanceHandler,
);

export default router;
