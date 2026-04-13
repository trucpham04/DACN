import { Router } from "express";
import { getAttendancesBySectionHandler } from "../controllers/attendanceController";
import { getRegistrationsBySectionHandler } from "../controllers/registrationController";
import { getSchedulesBySectionHandler } from "../controllers/scheduleController";
import {
  createSectionHandler,
  deleteSectionHandler,
  getMySectionsHandler,
  getSectionDetailHandler,
  getSectionStudentsHandler,
  getSectionsHandler,
  updateSectionHandler,
  updateSectionStatusHandler,
  updateSectionVisibilityHandler,
} from "../controllers/sectionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/sections - List sections (ADMIN only)
router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "STUDENT"),
  getSectionsHandler,
);

// POST /api/sections - Create section (ADMIN only)
router.post("/", requireAuth, requireRole("ADMIN"), createSectionHandler);

// GET /api/sections/my-sections - Lecturer's own sections (LECTURER only)
router.get(
  "/my-sections",
  requireAuth,
  requireRole("LECTURER"),
  getMySectionsHandler,
);

// GET /api/sections/:sectionId/students - Students in section (ADMIN, LECTURER)
router.get(
  "/:sectionId/students",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getSectionStudentsHandler,
);

// PATCH /api/sections/:sectionId/status - Update section status (ADMIN, LECTURER)
router.patch(
  "/:sectionId/status",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  updateSectionStatusHandler,
);

// PATCH /api/sections/:sectionId/visibility - Update section visibility (ADMIN, LECTURER)
router.patch(
  "/:sectionId/visibility",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  updateSectionVisibilityHandler,
);

// GET /api/sections/:sectionId/registrations - Section registration list (ADMIN, LECTURER)
router.get(
  "/:sectionId/registrations",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getRegistrationsBySectionHandler,
);

// GET /api/sections/:sectionId/schedules - Schedules in section (Any auth)
router.get("/:sectionId/schedules", requireAuth, getSchedulesBySectionHandler);

// GET /api/sections/:sectionId/attendances - Attendance sessions in section (ADMIN, LECTURER)
router.get(
  "/:sectionId/attendances",
  requireAuth,
  requireRole("ADMIN", "LECTURER"),
  getAttendancesBySectionHandler,
);

// GET /api/sections/:sectionId - Section detail (Any auth)
router.get("/:sectionId", requireAuth, getSectionDetailHandler);

// PUT /api/sections/:sectionId - Update section (ADMIN only)
router.put(
  "/:sectionId",
  requireAuth,
  requireRole("ADMIN"),
  updateSectionHandler,
);

// DELETE /api/sections/:sectionId - Delete section (ADMIN only)
router.delete(
  "/:sectionId",
  requireAuth,
  requireRole("ADMIN"),
  deleteSectionHandler,
);

export default router;
