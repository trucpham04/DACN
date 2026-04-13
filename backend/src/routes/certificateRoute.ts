import { Router } from "express";
import {
  createCertificateHandler,
  deleteCertificateHandler,
  getCertificateHandler,
  listCertificatesHandler,
  updateCertificateHandler,
} from "../controllers/certificateController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Admin: GET /api/certificates - Danh sách chứng chỉ
router.get("/", requireAuth, requireRole("ADMIN"), listCertificatesHandler);

// Admin: POST /api/certificates - Tạo chứng chỉ cho hồ sơ
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "STUDENT"),
  createCertificateHandler,
);

// Admin/Owner: GET /api/certificates/:certificateId
router.get("/:certificateId", requireAuth, getCertificateHandler);

// Admin: PUT /api/certificates/:certificateId
router.put(
  "/:certificateId",
  requireAuth,
  requireRole("ADMIN"),
  updateCertificateHandler,
);

// Admin: DELETE /api/certificates/:certificateId
router.delete(
  "/:certificateId",
  requireAuth,
  requireRole("ADMIN"),
  deleteCertificateHandler,
);

export default router;
