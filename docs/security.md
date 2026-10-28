# Security notes
- bcrypt (12 rounds); passwords 8-72 chars with a letter and a number. Login runs a dummy hash for unknown emails to avoid timing leaks.
- Access tokens (1 h) + refresh tokens (7 d), separate secrets, validated at start-up (32+ chars). Every request re-checks that the user still exists and is active, so disabling an account takes effect immediately.
- RBAC server-side: `requireRole` for coarse access; `access.service.ts` for per-class / per-student scoping (teachers only see their classes; students only themselves; unpublished marks hidden from students).
- Public registration can only create STUDENT accounts.
- Zod validates body/query/params; Prisma parameterises queries; CSV export neutralises formula injection.
- helmet, CORS allow-list from `CLIENT_URL`, rate limit on `/auth/*`, 1 MB JSON limit, uploads limited to 2 MB JPEG/PNG/WebP with server-generated filenames.
- Password reset tokens are random, stored hashed, expire in 30 min, single use. Responses don't reveal whether an email exists.
- **Known trade-offs / TODO:** tokens live in `localStorage` (XSS exposure; consider httpOnly cookies + CSRF protection); uploaded file type is checked by MIME header only (add magic-byte sniffing); no email delivery yet; no refresh-token revocation list; add DB backups and log shipping before production.
