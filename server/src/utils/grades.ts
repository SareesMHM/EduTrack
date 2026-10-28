export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

/** A >= 75%, B >= 65%, C >= 50%, D >= 35%, otherwise F. */
export function marksToGrade(score: number, max: number): LetterGrade {
  if (max <= 0) throw new Error('max must be greater than 0');
  if (score < 0 || score > max) throw new Error('score must be between 0 and max');
  const pct = (score / max) * 100;
  if (pct >= 75) return 'A';
  if (pct >= 65) return 'B';
  if (pct >= 50) return 'C';
  if (pct >= 35) return 'D';
  return 'F';
}

export const isPass = (score: number, max: number) => (score / max) * 100 >= 35;
