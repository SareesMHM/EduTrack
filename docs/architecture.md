# Architecture
```
React client ──HTTPS──▶ Express API ──▶ PostgreSQL (Prisma)
                            └────────▶ FastAPI ML service (features computed by the API)
```
- **client**: pages grouped by role; `ProtectedRoute` is a convenience only, the API enforces access.
- **server**: routes → controllers (thin) → services (logic, access checks) → Prisma. `access.service.ts` centralises "may this user see this class/student".
- **ml-service**: receives five numeric features per student, never names or ids beyond an opaque `studentId`.
- Responses use `{ data, meta? }`; errors use `{ message, errors? }`.
- Schema changes vs. the proposal: `User.classId` (student → class), `User.isActive`, reset-token fields, `Attendance.class` relation, and a `Setting` model (13 models).
