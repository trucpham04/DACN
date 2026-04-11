# Backend Task Assignment

## Overview

| Member | Responsibility | Endpoints |
|---|---|:---:|
| **Member 1 (Leader)** | Infrastructure + Auth + Account + Profile | 18 + all infra |
| **Member 2** | Subject + Section + Registration + Schedule + Attendance | 36 |
| **Member 3** | Room + UsageHistory + ProfileApplication + CertificateType + CertificateDetail | 35 |

> **Dependency rule**: Member 2 and Member 3 are blocked until Member 1 finishes the infrastructure (middleware, auth guard, response formatter). Coordinate a handoff point after Step 0 + Step 1 of Member 1's tasks.

---

## Member 1 (Leader) — Infrastructure + Auth + Account + Profile

### Step 0 — Infrastructure ⚠️ Do this first, others are blocked

- [x] Install missing packages:
  ```
  pnpm add jsonwebtoken bcrypt zod
  pnpm add -D @types/jsonwebtoken @types/bcrypt
  ```
- [x] Fix `prisma/schema.prisma`:
  - Add `url = env("DATABASE_URL")` to the `datasource db` block
  - Add proper `@relation` annotation to `Subject.PrerequisiteSubjectID` (self-relation)
  - Remove `Usage_Section` model (duplicate of `SectionUsageHistory`) and clean up relations in `Section` and `UsageHistory`
- [ ] Email model hardening (new):
  - Add `Email String @unique @db.VarChar(255)` to `Account`
  - Migrate existing emails from `UserProfile.Email` to `Account.Email`
  - Remove `Email` from `UserProfile` after migration
  - Update Prisma migration and regenerate client
- [x] Set up folder structure under `src/`:
  ```
  src/
    middleware/
      auth.ts          # requireAuth, requireRole
      errorHandler.ts  # global error handler
    utils/
      response.ts      # standard { success, data, error, meta } formatter
    routes/
    controllers/
    services/
  ```
- [x] Implement response formatter utility (`success`, `data`, `error`, `meta`)
- [x] Implement global error handler middleware
- [x] Implement JWT auth middleware:
  - `requireAuth` — verifies Bearer token, attaches `req.user`
  - `requireRole(...roles)` — checks role against allowed list
- [x] Refactor `src/index.ts`: mount all routers under `/api`, apply `express.json()` and error handler
- [x] `GET /api/health` — health check endpoint

---

### Step 1 — Auth module

Base path: `/api/auth`

- [x] `POST /api/auth/login` — validate credentials, return `accessToken` + `refreshToken`, store refresh token in DB
- [x] `POST /api/auth/logout` — invalidate refresh token record
- [x] `POST /api/auth/refresh-token` — verify stored refresh token, issue new pair (rotation)
- [x] `PUT /api/auth/change-password` — verify `currentPassword`, hash and update `newPassword`
- [x] `POST /api/auth/register` — create `Account` (role: STUDENT) + `UserProfile`, validate `password` = `confirmPassword`, return tokens
- [x] Postman test cases for `POST /api/auth/register` (success + validation + duplicate) verified
- [x] Postman test cases for `POST /api/auth/login` (success + validation + credentials + inactive/banned) added

**Notes**:
- Hash passwords with `bcrypt` (min rounds: 10)
- Store refresh tokens in DB with expiry
- Password rules: min 8 chars, at least 1 uppercase, 1 number, 1 special character
- Require `confirmPassword` in register request and return `400` if it does not match `password`
- Register must persist email to `Account.Email` (unique source of truth)
- Register must force role to `STUDENT` and never accept role from client payload

---

### Step 2 — Account module

Base path: `/api/accounts`

- [x] `GET /api/accounts` — paginated list, filter by `role`. **Role: ADMIN**
- [x] `POST /api/accounts` — create account (any role). **Role: ADMIN**
- [x] `GET /api/accounts/me` — current user's account. **Any auth** _(register before `/:id`)_
- [x] `GET /api/accounts/:accountId` — account detail. **Role: ADMIN**
- [x] `PUT /api/accounts/:accountId` — update `username`, `role`. **Role: ADMIN**
- [x] `DELETE /api/accounts/:accountId` — delete account. **Role: ADMIN**

---

### Step 3 — UserProfile module

Base path: `/api/profiles`

- [x] `GET /api/profiles` — paginated, search by name/email. **Role: ADMIN**
- [x] `POST /api/profiles` — create profile. **Role: ADMIN**
- [x] `GET /api/profiles/me` — own profile. **Any auth** _(register before `/:id`)_
- [x] `PUT /api/profiles/me` — update own profile. **Any auth**
- [x] `GET /api/profiles/students` — student profiles. **Role: ADMIN, LECTURER** _(register before `/:id`)_
- [x] `GET /api/profiles/lecturers` — lecturer profiles. **Role: ADMIN** _(register before `/:id`)_
- [x] `GET /api/profiles/:profileId` — profile detail. **Role: ADMIN or owner**
- [x] `PUT /api/profiles/:profileId` — update profile. **Role: ADMIN or owner**
- [x] `GET /api/profiles/:profileId/attendance-summary` — attendance stats. **Role: ADMIN, LECTURER, or owner**
- [x] `GET /api/profiles/:profileId/certificates` — student's certificates. **Role: ADMIN or owner**
- [x] `POST /api/profiles/:profileId/certificates` — link certificate to student. **Role: ADMIN**
- [x] `DELETE /api/profiles/:profileId/certificates/:certificateId` — unlink. **Role: ADMIN**

**Notes**:
- For profile list/detail/student/lecturer endpoints, return email from `Account.Email` (join `account` relation)
- For profile list search by email, query against `Account.Email`

---

### Step 4 — Parent Relationship Core (API sync)

Base path: `/api/parents` and `/api/students`

- [x] `POST /api/parents/assign` — assign parent to student. **Role: ADMIN**
- [x] `DELETE /api/parents/assign` — unassign parent from student. **Role: ADMIN**
- [x] `GET /api/students/:studentId/parents` — list parents of a student. **Role: ADMIN**

---

## Member 2 — Subject + Section + Registration + Schedule + Attendance

> **Wait for**: Member 1 to finish Step 0 (infrastructure + middleware) before starting.

### Subject module

Base path: `/api/subjects`

- [x] `GET /api/subjects` — paginated, search by name. **Any auth**
- [x] `POST /api/subjects` — create subject. **Role: ADMIN**
- [x] Postman test cases for Subject list/create flows verified
- [x] `GET /api/subjects/:subjectId` — subject detail. **Any auth**
- [x] `PUT /api/subjects/:subjectId` — update. **Role: ADMIN**
- [x] `DELETE /api/subjects/:subjectId` — delete. **Role: ADMIN** _(guard: not linked to any section)_

---

### Section module

Base path: `/api/sections`

- [x] `GET /api/sections` — paginated, filter by `subjectId`, `year`, `status`. **Role: ADMIN**
- [x] `POST /api/sections` — create section. **Role: ADMIN**
- [x] `GET /api/sections/my-sections` — lecturer's own sections. **Role: LECTURER** _(register before `/:id`)_
- [x] `GET /api/sections/:sectionId` — section detail. **Any auth**
- [x] `PUT /api/sections/:sectionId` — update section. **Role: ADMIN**
- [x] `DELETE /api/sections/:sectionId` — delete. **Role: ADMIN** _(guard: has registered students)_
- [x] `GET /api/sections/:sectionId/students` — students in section. **Role: ADMIN, LECTURER**
- [x] `GET /api/sections/:sectionId/registrations` — registrations for a section. **Role: ADMIN, LECTURER**
- [x] `PATCH /api/sections/:sectionId/status` — update status. **Role: ADMIN, LECTURER**
- [x] `PATCH /api/sections/:sectionId/visibility` — update visibility. **Role: ADMIN, LECTURER**

**Status values**: `0` = draft, `1` = open, `2` = closed  
**Visibility values**: `0` = hidden, `1` = visible

---

### Registration module (API sync)

Base path: `/api/registrations`

- [x] `GET /api/registrations` — list all registrations. **Role: ADMIN**
- [x] `POST /api/registrations` — register section. **Role: STUDENT**
- [x] `DELETE /api/registrations/:sectionId` — cancel registration. **Role: STUDENT**
- [x] `GET /api/registrations/my-registrations` — list own registrations. **Role: STUDENT**

---

### Parent Access to Schedule & Attendance (API sync)

Base path: `/api/parents/students/:studentId`

- [x] `GET /api/parents/students/:studentId/schedule` — parent views linked student's schedule. **Role: PARENT**
- [x] `GET /api/parents/students/:studentId/attendance` — parent views linked student's attendance. **Role: PARENT**

---

### Schedule module

Base path: `/api/schedules` and `/api/sections/:sectionId/schedules`

- [x] `GET /api/schedules` — paginated, filter by `roomId`, `sectionId`. **Role: ADMIN**
- [x] `POST /api/schedules` — create schedule. **Role: ADMIN** _(guard: room conflict check)_
- [x] `GET /api/schedules/my-schedule` — personal schedule. **Any auth** _(register before `/:id`)_
- [x] `GET /api/schedules/:scheduleId` — schedule detail. **Any auth**
- [x] `PUT /api/schedules/:scheduleId` — update. **Role: ADMIN** _(guard: room conflict check)_
- [x] `DELETE /api/schedules/:scheduleId` — delete. **Role: ADMIN**
- [x] `GET /api/sections/:sectionId/schedules` — schedules for a section. **Any auth**

---

### Attendance module

Base path: `/api/attendances` and `/api/sections/:sectionId/attendances`

- [x] `GET /api/attendances` — paginated, filter by `sectionId`. **Role: ADMIN**
- [x] `POST /api/attendances` — create attendance session. **Role: LECTURER** _(guard: duplicate date+slot per section)_
- [x] `GET /api/attendances/:attendanceId` — detail. **Role: ADMIN, LECTURER**
- [x] `PUT /api/attendances/:attendanceId` — update. **Role: LECTURER**
- [x] `DELETE /api/attendances/:attendanceId` — delete. **Role: ADMIN, LECTURER**
- [x] `GET /api/sections/:sectionId/attendances` — attendance sessions for a section. **Role: ADMIN, LECTURER**

---

### AttendanceDetail module

Base path: `/api/attendances/:attendanceId/details`

- [x] `GET /api/attendances/:attendanceId/details` — all student statuses for a session. **Role: ADMIN, LECTURER**
- [x] `POST /api/attendances/:attendanceId/details` — bulk create details. **Role: LECTURER** _(guard: already created for this session)_
- [x] `PUT /api/attendances/:attendanceId/details/:detailId` — update one student's status. **Role: LECTURER**

**Status values**: `present`, `absent`, `late`

---

## Member 3 — Room + UsageHistory + ProfileApplication + CertificateType + CertificateDetail

> **Wait for**: Member 1 to finish Step 0 (infrastructure + middleware) before starting.  
> **Schema note**: `Usage_Section` has been removed; use `SectionUsageHistory` for all UsageHistory ↔ Section relations.

### Room module

Base path: `/api/rooms`

- [x] `GET /api/rooms` — paginated, filter by `campus`, `roomType`, `status`. **Any auth**
- [x] `POST /api/rooms` — create room. **Role: ADMIN** _(guard: roomName unique)_
- [x] `GET /api/rooms/available` — rooms free for a given date/period/capacity. **Role: ADMIN** _(register before `/:id`)_
- [x] `GET /api/rooms/:roomId` — room detail. **Any auth**
- [x] `PUT /api/rooms/:roomId` — update room. **Role: ADMIN**
- [x] `DELETE /api/rooms/:roomId` — delete room. **Role: ADMIN** _(guard: has active schedules)_
- [x] `GET /api/rooms/:roomId/schedules` — schedules for a room. **Role: ADMIN**
- [x] `GET /api/rooms/:roomId/usage-histories` — usage history for a room. **Role: ADMIN**
- [x] Postman test cases for all implemented Room endpoints verified

---

### UsageHistory module

Base path: `/api/usage-histories`

- [x] `GET /api/usage-histories` — paginated, filter by `roomId`. **Role: ADMIN**
- [x] `POST /api/usage-histories` — create usage record. **Role: ADMIN**
- [x] `GET /api/usage-histories/:usageHistoryId` — detail (includes linked sections). **Role: ADMIN**
- [x] `PUT /api/usage-histories/:usageHistoryId` — update. **Role: ADMIN**
- [x] `DELETE /api/usage-histories/:usageHistoryId` — delete. **Role: ADMIN**
- [x] `POST /api/usage-histories/:usageHistoryId/sections` — link a section. **Role: ADMIN** _(guard: already linked)_
- [x] `DELETE /api/usage-histories/:usageHistoryId/sections/:sectionId` — unlink a section. **Role: ADMIN**

---

### ProfileApplication module

Base path: `/api/profile-applications`

- [x] `GET /api/profile-applications` — paginated, filter by `applicationStatus`. **Role: ADMIN**
- [x] `POST /api/profile-applications` — student submits an application. **Role: STUDENT** _(guard: pending application already exists)_
- [x] `GET /api/profile-applications/my-applications` — own applications. **Role: STUDENT** _(register before `/:id`)_
- [x] `GET /api/profile-applications/:applicationId` — detail. **Role: ADMIN or owner**
- [x] `PUT /api/profile-applications/:applicationId` — student updates. **Role: STUDENT (owner)** _(guard: already reviewed)_
- [x] `PATCH /api/profile-applications/:applicationId/review` — admin approves/rejects. **Role: ADMIN**
- [x] `GET /api/profile-applications/:applicationId/certificates` — certificates in an application. **Role: ADMIN or owner**

**Status values**: `pending`, `approved`, `rejected`

---

### CertificateType module

Base path: `/api/certificate-types`

- [x] `GET /api/certificate-types` — paginated list. **Any auth**
- [x] `POST /api/certificate-types` — create type. **Role: ADMIN** _(guard: typeName unique)_
- [x] `GET /api/certificate-types/:typeId` — type detail. **Any auth**
- [x] `PUT /api/certificate-types/:typeId` — update. **Role: ADMIN**
- [x] `DELETE /api/certificate-types/:typeId` — delete. **Role: ADMIN** _(guard: in use by certificates)_

---

### CertificateDetail module

Base path: `/api/certificates`

- [x] `GET /api/certificates` — paginated, filter by `certificateTypeId`. **Role: ADMIN**
- [x] `POST /api/certificates` — create certificate for an application. **Role: ADMIN**
- [x] `GET /api/certificates/:certificateId` — detail. **Role: ADMIN or owner**
- [x] `PUT /api/certificates/:certificateId` — update. **Role: ADMIN**
- [x] `DELETE /api/certificates/:certificateId` — delete. **Role: ADMIN**

---

### Parent Student List Endpoints (API sync)

Base path: `/api/parents`

- [ ] `GET /api/parents/:parentId/students` — admin views students linked to a parent. **Role: ADMIN**
- [x] `GET /api/parents/my-students` — parent views own linked students. **Role: PARENT**

---

## General Conventions (All Members)

### Folder structure per module
```
src/
  routes/         authRoute.ts, accountRoute.ts, ...
  controllers/    authController.ts, accountController.ts, ...
  services/       authService.ts, accountService.ts, ...
```

### Response format (always use the utility from `src/utils/response.ts`)
```json
{
  "success": true | false,
  "data": <object | array | null>,
  "error": { "code": "ERROR_CODE", "message": "..." } | null,
  "meta": { "page": 1, "limit": 10, "total": 100 } | null
}
```

### HTTP status codes
| Situation | Code |
|---|---|
| Success GET / PUT / PATCH / DELETE | 200 |
| Success POST (created) | 201 |
| Validation error | 400 |
| Unauthorized (no token) | 401 |
| Forbidden (wrong role) | 403 |
| Not found | 404 |
| Conflict (duplicate) | 409 |
| Server error | 500 |

### Input validation
- Use `zod` for all request body and query param validation
- Return `400` with descriptive message on validation failure

### Route ordering rule
Static routes (e.g. `/me`, `/my-sections`, `/available`) **must be registered before** dynamic routes (e.g. `/:id`) to avoid Express matching them as IDs.


