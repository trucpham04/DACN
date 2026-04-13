import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  CERTIFICATE_ERROR_CODES,
  CERTIFICATE_ERROR_MESSAGES,
  CERTIFICATE_FIELD_ERROR_MESSAGES,
  type CertificateErrorCode,
} from "../constants/errors/certificate";
import { AppError } from "../middleware/errorHandler";
import { prisma } from "../prisma/prismaClient";

const businessErrorDetails = (message: string) => ({
  formErrors: [message],
  fieldErrors: {},
});

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
  metadata: z.record(z.string(), z.unknown()).optional(), // Fix #5
});

const updateSchema = z.object({
  score: z.number().min(0).max(10).optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  evidenceURL: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(), // Fix #5
});

export interface CertificateListItem {
  certificateId: number;
  applicationId: number;
  certificateTypeId: number;
  typeName: string;
  score: number | null;
  issueDate: string | null;
  expiryDate: string | null;
  evidenceURL: string | null;
}

export interface CertificateDetailItem {
  certificateId: number;
  applicationId: number;
  studentProfileId: number | null;
  certificateTypeId: number;
  typeName: string;
  score: number | null;
  issueDate: string | null;
  expiryDate: string | null;
  evidenceURL: string | null;
  metadata: any;
}

export interface CertificateListResult {
  rows: CertificateListItem[];
  total: number;
}

type CertificateWithRelations = Prisma.CertificateDetailGetPayload<{
  include: {
    certificateType: {
      select: {
        CertificateTypeID: true;
        TypeName: true;
      };
    };
    application: {
      select: {
        ApplicationID: true;
        StudentProfileID: true;
      };
    };
  };
}>;

export const listCertificates = async (
  params: z.infer<typeof listSchema>,
): Promise<CertificateListResult> => {
  const validated = listSchema.parse(params);
  const where: any = {};

  if (validated.certificateTypeId) {
    where.CertificateTypeID = validated.certificateTypeId;
  }

  if (validated.search) {
    where.OR = [
      {
        certificateType: {
          TypeName: { contains: validated.search, mode: "insensitive" },
        },
      },
      { EvidenceURL: { contains: validated.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.certificateDetail.findMany({
      where,
      skip: (validated.page - 1) * validated.limit,
      take: validated.limit,
      orderBy: { CertificateID: "desc" },
      include: {
        certificateType: {
          select: {
            CertificateTypeID: true,
            TypeName: true,
          },
        },
        application: {
          select: { ApplicationID: true, StudentProfileID: true },
        },
      },
    }) as Promise<CertificateWithRelations[]>,
    prisma.certificateDetail.count({ where }),
  ]);

  const rows: CertificateListItem[] = items.map((item) => ({
    certificateId: item.CertificateID,
    applicationId: item.application!.ApplicationID,
    certificateTypeId: item.CertificateTypeID,
    typeName: item.certificateType!.TypeName,
    score: item.Score,
    issueDate: item.IssueDate?.toISOString().split("T")[0] ?? null,
    expiryDate: item.ExpiryDate?.toISOString().split("T")[0] ?? null,
    evidenceURL: item.EvidenceURL,
  }));

  return {
    rows,
    total,
  };
};

const validateDates = (issueDateStr?: string, expiryDateStr?: string) => {
  let issueDate: Date | undefined;
  let expiryDate: Date | undefined;

  if (issueDateStr) {
    issueDate = new Date(issueDateStr + "T00:00:00.000Z");
    if (isNaN(issueDate.getTime())) {
      throw new AppError(CERTIFICATE_FIELD_ERROR_MESSAGES.ISSUE_DATE_INVALID, {
        statusCode: 400,
        code: "CERTIFICATE_DATE_INVALID",
        details: {
          formErrors: [],
          fieldErrors: {
            issueDate: [CERTIFICATE_FIELD_ERROR_MESSAGES.ISSUE_DATE_INVALID],
          },
        },
      });
    }
  }

  if (expiryDateStr) {
    expiryDate = new Date(expiryDateStr + "T00:00:00.000Z");
    if (isNaN(expiryDate.getTime())) {
      throw new AppError(CERTIFICATE_FIELD_ERROR_MESSAGES.EXPIRY_DATE_INVALID, {
        statusCode: 400,
        code: "CERTIFICATE_DATE_INVALID",
        details: {
          formErrors: [],
          fieldErrors: {
            expiryDate: [CERTIFICATE_FIELD_ERROR_MESSAGES.EXPIRY_DATE_INVALID],
          },
        },
      });
    }
  }

  if (issueDate && expiryDate && issueDate > expiryDate) {
    throw new AppError(
      CERTIFICATE_FIELD_ERROR_MESSAGES.ISSUE_DATE_AFTER_EXPIRY,
      {
        statusCode: 400,
        code: "CERTIFICATE_DATE_INVALID",
        details: {
          formErrors: [],
          fieldErrors: {
            issueDate: [
              CERTIFICATE_FIELD_ERROR_MESSAGES.ISSUE_DATE_AFTER_EXPIRY,
            ],
            expiryDate: [
              CERTIFICATE_FIELD_ERROR_MESSAGES.ISSUE_DATE_AFTER_EXPIRY,
            ],
          },
        },
      },
    );
  }

  return { issueDate, expiryDate };
};

export const createCertificate = async (
  input: z.infer<typeof createSchema>,
  adminAccountId: number,
) => {
  const validated = createSchema.parse(input);

  // Verify application approved
  const app = await prisma.profileApplication.findUnique({
    where: { ApplicationID: validated.applicationId },
    select: { ApplicationStatus: true, StudentProfileID: true },
  });

  if (!app) {
    throw new AppError(
      CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED,
      {
        statusCode: 404,
        code: CERTIFICATE_ERROR_CODES.CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED,
        details: businessErrorDetails("Hồ sơ không tồn tại"),
      },
    );
  }

  // this code is commented out because we want to allow the creation of certificates for unapproved applications

  // if (app.ApplicationStatus !== "APPROVED") {
  //   throw new AppError(
  //     CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED,
  //     {
  //       statusCode: 409,
  //       code: CERTIFICATE_ERROR_CODES.CERTIFICATE_CREATE_APPLICATION_NOT_APPROVED,
  //       details: businessErrorDetails("Hồ sơ phải được duyệt trước khi tạo chứng chỉ"),
  //     }
  //   );
  // }

  // Verify type exists
  const certType = await prisma.certificateType.findUnique({
    where: { CertificateTypeID: validated.certificateTypeId },
  });

  if (!certType) {
    throw new AppError(
      CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_CREATE_TYPE_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_ERROR_CODES.CERTIFICATE_CREATE_TYPE_NOT_FOUND,
        details: businessErrorDetails("Loại chứng chỉ không tồn tại"),
      },
    );
  }

  // Validate dates
  const { issueDate, expiryDate } = validateDates(
    validated.issueDate,
    validated.expiryDate,
  );

  const cert = (await prisma.certificateDetail.create({
    data: {
      ApplicationID: validated.applicationId,
      CertificateTypeID: validated.certificateTypeId,
      CreatedByAccountID: adminAccountId, // Fix #2
      Score: validated.score,
      IssueDate: issueDate,
      ExpiryDate: expiryDate,
      EvidenceURL: validated.evidenceURL,
      Metadata: validated.metadata as Prisma.InputJsonValue,
    },
    include: {
      certificateType: {
        select: {
          CertificateTypeID: true,
          TypeName: true,
        },
      },
      application: {
        select: {
          ApplicationID: true,
          StudentProfileID: true,
        },
      },
    },
  })) as CertificateWithRelations;

  if (!cert.application) {
    throw new AppError("Không tìm thấy hồ sơ sau khi tạo chứng chỉ", {
      statusCode: 500,
      code: "INTERNAL_ERROR" as any,
    });
  }

  return {
    certificateId: cert.CertificateID,
    applicationId: cert.application.ApplicationID,
    studentProfileId: cert.application.StudentProfileID,
    certificateTypeId: cert.CertificateTypeID,
    typeName: cert.certificateType!.TypeName,
    score: cert.Score,
    issueDate: cert.IssueDate?.toISOString().split("T")[0] ?? null,
    expiryDate: cert.ExpiryDate?.toISOString().split("T")[0] ?? null,
    evidenceURL: cert.EvidenceURL,
    metadata: validated.metadata,
  } as CertificateDetailItem;
};

export const getCertificate = async (certId: number) => {
  const cert = (await prisma.certificateDetail.findUnique({
    where: { CertificateID: certId },
    include: {
      // Fix #1 + #6
      certificateType: {
        select: {
          CertificateTypeID: true,
          TypeName: true,
        },
      },
      application: {
        select: { StudentProfileID: true, ApplicationID: true },
      },
    },
  })) as CertificateWithRelations | null;

  if (!cert) {
    throw new AppError(
      CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DETAIL_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_ERROR_CODES.CERTIFICATE_DETAIL_NOT_FOUND,
        details: businessErrorDetails(
          CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DETAIL_NOT_FOUND,
        ),
      },
    );
  }

  if (!cert.application) {
    // Fix #6
    throw new AppError("Không tìm thấy hồ sơ liên quan đến chứng chỉ", {
      statusCode: 500,
      code: "INTERNAL_ERROR" as any,
    });
  }

  return {
    certificateId: cert.CertificateID,
    applicationId: cert.ApplicationID,
    studentProfileId: cert.application.StudentProfileID,
    certificateTypeId: cert.CertificateTypeID,
    typeName: cert.certificateType!.TypeName,
    score: cert.Score,
    issueDate: cert.IssueDate?.toISOString().split("T")[0] ?? null,
    expiryDate: cert.ExpiryDate?.toISOString().split("T")[0] ?? null,
    evidenceURL: cert.EvidenceURL,
    metadata: cert.Metadata,
  } as CertificateDetailItem;
};

export const updateCertificate = async (
  certId: number,
  input: z.infer<typeof updateSchema>,
) => {
  const validated = updateSchema.parse(input);

  const cert = await prisma.certificateDetail.findUnique({
    where: { CertificateID: certId },
  });

  if (!cert) {
    throw new AppError(
      CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_UPDATE_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_ERROR_CODES.CERTIFICATE_UPDATE_NOT_FOUND,
        details: businessErrorDetails(
          CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_UPDATE_NOT_FOUND,
        ),
      },
    );
  }

  // Validate dates
  const { issueDate, expiryDate } = validateDates(
    validated.issueDate,
    validated.expiryDate,
  );

  const updated = (await prisma.certificateDetail.update({
    where: { CertificateID: certId },
    data: {
      Score: validated.score,
      IssueDate: issueDate,
      ExpiryDate: expiryDate,
      EvidenceURL: validated.evidenceURL,
      Metadata: validated.metadata as Prisma.InputJsonValue,
    },
    include: {
      // Fix #1
      certificateType: {
        select: {
          CertificateTypeID: true,
          TypeName: true,
        },
      },
      application: {
        select: { StudentProfileID: true, ApplicationID: true },
      },
    },
  })) as CertificateWithRelations;

  if (!updated.application) {
    // Fix #6
    throw new AppError(
      "Không tìm thấy hồ sơ liên quan đến chứng chỉ sau khi cập nhật",
      {
        statusCode: 500,
        code: "INTERNAL_ERROR" as any,
      },
    );
  }

  return {
    certificateId: updated.CertificateID,
    applicationId: updated.ApplicationID,
    studentProfileId: updated.application.StudentProfileID,
    certificateTypeId: updated.CertificateTypeID,
    typeName: updated.certificateType!.TypeName,
    score: updated.Score,
    issueDate: updated.IssueDate?.toISOString().split("T")[0] ?? null,
    expiryDate: updated.ExpiryDate?.toISOString().split("T")[0] ?? null,
    evidenceURL: updated.EvidenceURL,
    metadata: validated.metadata ?? updated.Metadata,
  } as CertificateDetailItem;
};

export const deleteCertificate = async (certId: number) => {
  const cert = await prisma.certificateDetail.findUnique({
    where: { CertificateID: certId },
  });

  if (!cert) {
    throw new AppError(
      CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DELETE_NOT_FOUND,
      {
        statusCode: 404,
        code: CERTIFICATE_ERROR_CODES.CERTIFICATE_DELETE_NOT_FOUND,
        details: businessErrorDetails(
          CERTIFICATE_ERROR_MESSAGES.CERTIFICATE_DELETE_NOT_FOUND,
        ),
      },
    );
  }

  // Check if used in StudentCertificates
  const studentCertCount = await prisma.studentCertificates.count({
    where: { CertificateID: certId },
  });

  if (studentCertCount > 0) {
    throw new AppError("Chứng chỉ đang được sử dụng trong hồ sơ sinh viên", {
      statusCode: 409,
      code: "CERTIFICATE_DELETE_IN_USE" as any,
      details: businessErrorDetails(
        "Chứng chỉ đang được sử dụng trong hồ sơ sinh viên",
      ),
    });
  }

  await prisma.certificateDetail.delete({
    where: { CertificateID: certId },
  });

  return { deleted: true };
};
