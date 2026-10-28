# Setup guide
1. Prerequisites: Node 20+, Docker, Python 3.11 (only to run ML tests locally).
2. `git clone` then `cp .env.example .env` and fill in `JWT_SECRET`, `JWT_REFRESH_SECRET` (each 32+ random characters) and `POSTGRES_PASSWORD`.
3. Docker route: `docker compose up --build -d`, then `docker compose exec server npx tsx prisma/seed.ts`.
4. Local route: see README. Run `npx prisma migrate dev --name init --schema server/prisma/schema.prisma` once and **commit `server/prisma/migrations/`**. Without migrations the server container falls back to `prisma db push`, which is fine for development but not for production.
5. Password-reset links are written to the server log in development (no email provider is wired in yet).
