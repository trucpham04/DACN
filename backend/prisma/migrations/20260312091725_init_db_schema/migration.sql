-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('ADMIN', 'LECTURER', 'STUDENT');

-- CreateTable
CREATE TABLE "Account" (
    "AccountID" SERIAL NOT NULL,
    "Role" "RoleEnum" NOT NULL,
    "Username" VARCHAR(255) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("AccountID")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "ProfileID" SERIAL NOT NULL,
    "AccountID" INTEGER NOT NULL,
    "FullName" VARCHAR(255),
    "PhoneNumber" VARCHAR(255),
    "DateOfBirth" DATE,
    "Gender" VARCHAR(255),
    "Email" VARCHAR(255),
    "Avatar" VARCHAR(255),
    "CitizenID" VARCHAR(255),
    "Hometown" VARCHAR(255),
    "Status" VARCHAR(255),

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("ProfileID")
);

-- CreateTable
CREATE TABLE "Subject" (
    "SubjectID" SERIAL NOT NULL,
    "PrerequisiteSubjectID" INTEGER,
    "SubjectName" VARCHAR(255) NOT NULL,
    "Periods" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("SubjectID")
);

-- CreateTable
CREATE TABLE "Section" (
    "SectionID" SERIAL NOT NULL,
    "LecturerProfileID" INTEGER NOT NULL,
    "SubjectID" INTEGER NOT NULL,
    "Year" VARCHAR(255) NOT NULL,
    "EnrollmentCount" INTEGER NOT NULL DEFAULT 0,
    "MaxCapacity" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "visibility" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("SectionID")
);

-- CreateTable
CREATE TABLE "Registration" (
    "SectionID" INTEGER NOT NULL,
    "StudentProfileID" INTEGER NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("SectionID","StudentProfileID")
);

-- CreateTable
CREATE TABLE "Room" (
    "RoomID" SERIAL NOT NULL,
    "RoomName" VARCHAR(255) NOT NULL,
    "RoomType" VARCHAR(255),
    "Campus" VARCHAR(255),
    "Capacity" INTEGER,
    "Status" VARCHAR(255),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("RoomID")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "ScheduleID" SERIAL NOT NULL,
    "RoomID" INTEGER NOT NULL,
    "SectionID" INTEGER NOT NULL,
    "DayOfWeek" VARCHAR(255) NOT NULL,
    "StartPeriod" INTEGER NOT NULL,
    "EndPeriod" INTEGER NOT NULL,
    "TotalPeriods" INTEGER NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("ScheduleID")
);

-- CreateTable
CREATE TABLE "UsageHistory" (
    "UsageHistoryID" SERIAL NOT NULL,
    "RoomID" INTEGER NOT NULL,
    "StartTime" DATE NOT NULL,
    "EndTime" DATE NOT NULL,
    "Note" VARCHAR(255),

    CONSTRAINT "UsageHistory_pkey" PRIMARY KEY ("UsageHistoryID")
);

-- CreateTable
CREATE TABLE "SectionUsageHistory" (
    "UsageHistoryID" INTEGER NOT NULL,
    "SectionID" INTEGER NOT NULL,

    CONSTRAINT "SectionUsageHistory_pkey" PRIMARY KEY ("UsageHistoryID","SectionID")
);

-- CreateTable
CREATE TABLE "Usage_Section" (
    "UsageHistoryID" INTEGER NOT NULL,
    "SectionID" INTEGER NOT NULL,

    CONSTRAINT "Usage_Section_pkey" PRIMARY KEY ("UsageHistoryID","SectionID")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "AttendanceID" SERIAL NOT NULL,
    "SectionID" INTEGER NOT NULL,
    "AttendanceDate" DATE NOT NULL,
    "Slot" INTEGER NOT NULL,
    "Note" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("AttendanceID")
);

-- CreateTable
CREATE TABLE "AttendanceDetail" (
    "AttendanceDetailID" SERIAL NOT NULL,
    "AttendanceID" INTEGER NOT NULL,
    "StudentProfileID" INTEGER NOT NULL,
    "Status" VARCHAR(255),
    "Note" TEXT,

    CONSTRAINT "AttendanceDetail_pkey" PRIMARY KEY ("AttendanceDetailID")
);

-- CreateTable
CREATE TABLE "ProfileApplication" (
    "ApplicationID" SERIAL NOT NULL,
    "StudentProfileID" INTEGER NOT NULL,
    "ApplicationStatus" VARCHAR(255),
    "SubmissionDate" TIMESTAMP(3),
    "ReviewedByProfileID" INTEGER,
    "ReviewDate" TIMESTAMP(3),
    "ReviewNotes" TEXT,

    CONSTRAINT "ProfileApplication_pkey" PRIMARY KEY ("ApplicationID")
);

-- CreateTable
CREATE TABLE "CertificateType" (
    "CertificateTypeID" SERIAL NOT NULL,
    "TypeName" VARCHAR(255) NOT NULL,
    "Description" TEXT,

    CONSTRAINT "CertificateType_pkey" PRIMARY KEY ("CertificateTypeID")
);

-- CreateTable
CREATE TABLE "CertificateDetail" (
    "CertificateID" SERIAL NOT NULL,
    "ApplicationID" INTEGER NOT NULL,
    "CertificateTypeID" INTEGER NOT NULL,
    "Score" DOUBLE PRECISION,
    "IssueDate" DATE,
    "ExpiryDate" DATE,
    "EvidenceURL" VARCHAR(255),
    "Metadata" JSONB,

    CONSTRAINT "CertificateDetail_pkey" PRIMARY KEY ("CertificateID")
);

-- CreateTable
CREATE TABLE "StudentCertificates" (
    "StudentID" INTEGER NOT NULL,
    "CertificateID" INTEGER NOT NULL,

    CONSTRAINT "StudentCertificates_pkey" PRIMARY KEY ("StudentID","CertificateID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_Username_key" ON "Account"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_AccountID_key" ON "UserProfile"("AccountID");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_AccountID_fkey" FOREIGN KEY ("AccountID") REFERENCES "Account"("AccountID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_LecturerProfileID_fkey" FOREIGN KEY ("LecturerProfileID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_SubjectID_fkey" FOREIGN KEY ("SubjectID") REFERENCES "Subject"("SubjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_SectionID_fkey" FOREIGN KEY ("SectionID") REFERENCES "Section"("SectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_StudentProfileID_fkey" FOREIGN KEY ("StudentProfileID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_RoomID_fkey" FOREIGN KEY ("RoomID") REFERENCES "Room"("RoomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_SectionID_fkey" FOREIGN KEY ("SectionID") REFERENCES "Section"("SectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageHistory" ADD CONSTRAINT "UsageHistory_RoomID_fkey" FOREIGN KEY ("RoomID") REFERENCES "Room"("RoomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionUsageHistory" ADD CONSTRAINT "SectionUsageHistory_UsageHistoryID_fkey" FOREIGN KEY ("UsageHistoryID") REFERENCES "UsageHistory"("UsageHistoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionUsageHistory" ADD CONSTRAINT "SectionUsageHistory_SectionID_fkey" FOREIGN KEY ("SectionID") REFERENCES "Section"("SectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage_Section" ADD CONSTRAINT "Usage_Section_UsageHistoryID_fkey" FOREIGN KEY ("UsageHistoryID") REFERENCES "UsageHistory"("UsageHistoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage_Section" ADD CONSTRAINT "Usage_Section_SectionID_fkey" FOREIGN KEY ("SectionID") REFERENCES "Section"("SectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_SectionID_fkey" FOREIGN KEY ("SectionID") REFERENCES "Section"("SectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDetail" ADD CONSTRAINT "AttendanceDetail_AttendanceID_fkey" FOREIGN KEY ("AttendanceID") REFERENCES "Attendance"("AttendanceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceDetail" ADD CONSTRAINT "AttendanceDetail_StudentProfileID_fkey" FOREIGN KEY ("StudentProfileID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileApplication" ADD CONSTRAINT "ProfileApplication_StudentProfileID_fkey" FOREIGN KEY ("StudentProfileID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileApplication" ADD CONSTRAINT "ProfileApplication_ReviewedByProfileID_fkey" FOREIGN KEY ("ReviewedByProfileID") REFERENCES "UserProfile"("ProfileID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateDetail" ADD CONSTRAINT "CertificateDetail_ApplicationID_fkey" FOREIGN KEY ("ApplicationID") REFERENCES "ProfileApplication"("ApplicationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateDetail" ADD CONSTRAINT "CertificateDetail_CertificateTypeID_fkey" FOREIGN KEY ("CertificateTypeID") REFERENCES "CertificateType"("CertificateTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCertificates" ADD CONSTRAINT "StudentCertificates_StudentID_fkey" FOREIGN KEY ("StudentID") REFERENCES "UserProfile"("ProfileID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCertificates" ADD CONSTRAINT "StudentCertificates_CertificateID_fkey" FOREIGN KEY ("CertificateID") REFERENCES "CertificateDetail"("CertificateID") ON DELETE RESTRICT ON UPDATE CASCADE;
