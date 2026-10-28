import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: process.env.E2E_URL ?? 'http://localhost:5173' },
  webServer: undefined, // start `docker compose up` or `npm run dev` + seed first
});
