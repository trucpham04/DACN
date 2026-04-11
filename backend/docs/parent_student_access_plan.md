# Parent Student Access Endpoints Plan

## Objective
Complete parent-facing student access endpoints:

- `GET /api/parents/my-students`
- `GET /api/parents/students/:studentId/schedule`
- `GET /api/parents/students/:studentId/attendance`

## Scope

### In Scope
- Implement route/controller/service logic for all 3 endpoints.
- Enforce `PARENT` role for all endpoints.
- Keep messages in Vietnamese.
- Apply query/path validation with Zod + shared validators.
- Enforce parent-student link authorization (`UserParents`) before schedule/attendance access.
- Add Postman test cases in the `Parents` folder.

### Out of Scope
- Parent assignment endpoints (`POST/DELETE /api/parents/assign`) refactor.
- Schema changes.
- Frontend UI updates.

## Implementation Notes

1. **Get My Students**
   - Uses current authenticated parent account to resolve parent profile.
   - Returns paginated linked students list.
   - Includes basic student profile and email fields.

2. **Get Linked Student Schedule**
   - Validates `studentId` path param and schedule filter query.
   - Ensures requested student is linked to current parent.
   - Filters by optional `sectionId`, `roomId`, `dayOfWeek`, `startDate`, `endDate`.
   - Returns normalized schedule rows aligned with API document fields.

3. **Get Linked Student Attendance**
   - Validates `studentId` path param and attendance filter query.
   - Ensures requested student is linked to current parent.
   - Filters by optional `subjectId`, `sectionId`, `startDate`, `endDate`.
   - Groups response by `subjectId + sectionId`, each group contains attendance sessions.

## Files Updated

- `backend/src/constants/errors/parent/codes.ts`
- `backend/src/constants/errors/parent/messages.ts`
- `backend/src/services/parentService.ts`
- `backend/src/controllers/parentController.ts`
- `backend/src/routes/parentRoute.ts`
- `backend/docs/postman/dacn-backend-test-cases.postman_collection.json`
- `backend/docs/TASKS.md`

## Postman Coverage (Planned)

1. `GET /api/parents/my-students`: success, missing token, forbidden role, invalid query.
2. `GET /api/parents/students/:studentId/schedule`: success, missing token, forbidden role, invalid studentId, invalid query, student not linked.
3. `GET /api/parents/students/:studentId/attendance`: success, missing token, forbidden role, invalid studentId, invalid query, student not linked.
