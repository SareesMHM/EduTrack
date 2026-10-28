# Testing
- Server unit: `npm run test -w server` (grade and attendance maths run without a database).
- Server integration (auth, RBAC, attendance, marks): need Postgres. Set `DATABASE_URL` to a **throw-away** database, run `npx prisma db push --schema server/prisma/schema.prisma`, then `npm run test -w server`. Tests wipe all tables. Without `DATABASE_URL` they are skipped.
- Client: `npm run test -w client` (Vitest + Testing Library).
- E2E: start the stack + seed, then `npx playwright install chromium && npm run e2e -w client`.
- ML: `cd ml-service && pytest -q`.
