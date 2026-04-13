import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  listCertificates,
  createCertificate,
  getCertificate,
  updateCertificate,
  deleteCertificate,
} from "../services/certificateService";
import { sendSuccess } from "../utils/response";
import { parseOrThrow, parsePositiveIntParamOrThrow } from "../utils/validation";
import { CERTIFICATE_ERROR_CODES } from "../constants/errors/certificate/codes";
import {
  CERTIFICATE_ERROR_MESSAGES,
  CERTIFICATE_FIELD_ERROR_MESSAGES,
} from "../constants/errors/certificate/index";

// Validation schemas
const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  certificateTypeId: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
});

const createSchema = z.object({
  applicationId: z.coerce.number().int().min(1),
  certificateTypeId: z.coerce.number().int().min(1),
  score: z.number().min(0).max(10).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  evidenceURL: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const updateSchema = z.object({
  score: z.number().min(0).max(10).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  evidenceURL: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function listCertificatesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = parseOrThrow(listSchema, req.query, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_LIST_INVALID_QUERY,
      message: CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_LIST_INVALID_QUERY,
    });

    const { rows, total } = await listCertificates(validated);
    const meta = {
      page: validated.page,
      limit: validated.limit,
      total,
    };
    sendSuccess(res, rows, 200, meta);
  } catch (error) {
    next(error);
  }
}

export async function createCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = parseOrThrow(createSchema, req.body, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED,
      message: "Dữ liệu tạo chứng chỉ không hợp lệ",
    });

    // auth middleware sets req.user.accountId (camelCase)
    const adminAccountId = req.user?.accountId ?? 0;
    const result = await createCertificate(validated, adminAccountId);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function getCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const certificateId = parsePositiveIntParamOrThrow(req.params.certificateId, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_DETAIL_NOT_FOUND,
      message: CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DETAIL_NOT_FOUND,
      fieldName: "certificateId",
      fieldMessage: "ID chứng chỉ không hợp lệ",
    });

    const result = await getCertificate(certificateId);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function updateCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const certificateId = parsePositiveIntParamOrThrow(req.params.certificateId, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_UPDATE_NOT_FOUND,
      message: CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_UPDATE_NOT_FOUND,
      fieldName: "certificateId",
      fieldMessage: "ID chứng chỉ không hợp lệ",
    });

    const validated = parseOrThrow(updateSchema, req.body, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_UPDATE_NOT_FOUND,
      message: "Dữ liệu cập nhật chứng chỉ không hợp lệ",
    });

    const result = await updateCertificate(certificateId, validated);
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function deleteCertificateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const certificateId = parsePositiveIntParamOrThrow(req.params.certificateId, {
      code: CERTIFICATE_ERROR_CODES.CERTIFICATE_DELETE_NOT_FOUND,
      message: CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DELETE_NOT_FOUND,
      fieldName: "certificateId",
      fieldMessage: "ID chứng chỉ không hợp lệ",
    });

    await deleteCertificate(certificateId);
    sendSuccess(res, { deleted: true }, 200);
  } catch (error) {
    next(error);
  }
}

