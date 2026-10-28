import { expect, test } from '@playwright/test';

// Requires the stack running with seed data (npm run db:seed). Password for all demo users: Password123!
const login = async (page: any, email: string) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
};

test('teacher marks attendance, student sees published results', async ({ page }) => {
  await login(page, 'teacher@edutrack.local');
  await expect(page).toHaveURL(/\/teacher/);
  await page.goto('/teacher/classes');
  await page.getByRole('link', { name: /10-A/ }).click();
  await page.getByRole('link', { name: 'Take attendance' }).click();
  await page.getByRole('button', { name: 'Absent' }).first().click();
  await page.getByRole('button', { name: 'Save register' }).click();
  await expect(page.getByText('Attendance saved')).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await login(page, 'student1@edutrack.local');
  await page.goto('/student/results');
  await expect(page.getByRole('table')).toBeVisible();
});

test('a student cannot open admin pages', async ({ page }) => {
  await login(page, 'student1@edutrack.local');
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/403/);
});
