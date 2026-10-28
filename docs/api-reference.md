# API reference (prefix `/api`, JSON, `Authorization: Bearer <token>`)
Roles: **A** admin, **T** teacher (own classes only), **S** student (own data only). "Any" = any signed-in user.

| Area | Endpoint | Who |
|---|---|---|
| Auth | POST `/auth/register` (always creates STUDENT), `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password/:token` | public (rate-limited) |
| | GET/PATCH `/auth/me`, POST `/auth/me/avatar`, `/auth/change-password` | Any |
| Users | GET/POST `/admin/users`, POST `/admin/users/bulk-import`, GET/PATCH/DELETE `/admin/users/:id`, PATCH `/:id/status`, POST `/:id/reset-password` | A |
| Students | GET `/students` (A, T), GET `/students/:id` (A, T own class, S self), PATCH `/:id`, POST `/:id/transfer` (A), GET `/:id/attendance-summary`, `/:id/results-summary`, GET/PATCH `/students/me/profile` (S) | see left |
| Teachers | GET `/teachers`, GET/PATCH `/teachers/:id`, PUT `/:id/classes`, PUT `/:id/subjects` (A); GET `/teachers/me/classes` (T) | |
| Classes | GET `/classes` (scoped), GET `/classes/:id`, GET `/:id/students` (A,T); POST, PATCH, DELETE, PUT `/:id/subjects` (A) | |
| Subjects | GET (Any); POST/PATCH/DELETE (A) | |
| Grades | GET (public); POST/PATCH/DELETE (A) | |
| Attendance | POST `/attendance/bulk`, PATCH `/:id`, GET `/history`, `/low`, `/export`, `/class/:classId`, `/summary/class/:classId` (A,T); GET `/student/:studentId`, `/percentage/:studentId` (own for S) | |
| Exams | GET (S sees published only), GET `/:id`; POST, PATCH, DELETE, POST `/:id/publish`, `/:id/unpublish` (A,T) | |
| Marks | POST `/marks/bulk`, PATCH/DELETE `/:id`, GET `/exam/:examId` (A,T); GET `/student/:studentId` (S: published only) | |
| Results | GET `/results/exam/:examId/summary`, `/ranking`, POST `/exam/:examId/publish` (A,T); GET `/published`, `/report-card/:studentId`, `/student/:studentId/exam/:examId` | |
| Dashboard | GET `/dashboard/admin` (A), `/teacher` (T), `/student` (S), `/stats`, `/top-performers`, `/at-risk` (A,T) | |
| Reports | GET `/reports/search`, `/term`, `/export/students`, `/export/term` | A, T |
| ML | GET `/ml/health`, `/ml/explain/:studentId`, `/ml/at-risk`, POST `/ml/predict` (A,T); POST `/ml/train`, GET `/ml/evaluate` (A) | |
| Notifications | GET `/notifications`, PATCH `/:id/read`, PATCH `/read-all` | Any |
| Settings | GET (Any), PUT (A) | |

Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict (duplicate / in use), 503 ML service unreachable.
