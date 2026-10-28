/** Mirrors server/src/utils/grades.ts so the marks grid can preview grades live. */
export function formatGrade(score: number, max: number): string {
  if (!max || score < 0 || score > max || Number.isNaN(score)) return '—';
  const pct = (score / max) * 100;
  return pct >= 75 ? 'A' : pct >= 65 ? 'B' : pct >= 50 ? 'C' : pct >= 35 ? 'D' : 'F';
}
export const percent = (score: number, max: number) => Math.round((score / max) * 1000) / 10;
