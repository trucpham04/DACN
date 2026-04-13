import { Router } from "express";
import {
  createRegistrationHandler,
  deleteRegistrationHandler,
  getMyRegistrationsHandler,
  getRegistrationsHandler,
} from "../controllers/registrationController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// GET /api/registrations - Get registrations list (ADMIN only)
router.get("/", requireAuth, requireRole("ADMIN"), getRegistrationsHandler);

// GET /api/registrations/my-registrations - Get own registrations (STUDENT only)
router.get(
  "/my-registrations",
  requireAuth,
  requireRole("STUDENT"),
  getMyRegistrationsHandler,
);

// POST /api/registrations - Register section (STUDENT only)
router.post(
  "/",
  requireAuth,
  requireRole("STUDENT"),
  createRegistrationHandler,
);

// DELETE /api/registrations/:sectionId - Cancel registration (STUDENT only)
router.delete(
  "/:sectionId",
  requireAuth,
  requireRole("STUDENT"),
  deleteRegistrationHandler,
);

export default router;
