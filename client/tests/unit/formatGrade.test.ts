import { describe, expect, it } from 'vitest';
import { formatGrade, percent } from '../../src/utils/formatGrade';

describe('formatGrade (must match server marksToGrade)', () => {
  it.each([[100, 'A'], [75, 'A'], [74, 'B'], [65, 'B'], [64, 'C'], [50, 'C'], [49, 'D'], [35, 'D'], [34, 'F']])('%i/100 -> %s', (s, g) => expect(formatGrade(s, 100)).toBe(g));
  it('returns a dash for invalid input', () => { expect(formatGrade(101, 100)).toBe('—'); expect(formatGrade(NaN, 100)).toBe('—'); });
  it('percent rounds to one decimal', () => expect(percent(1, 3)).toBe(33.3));
});
