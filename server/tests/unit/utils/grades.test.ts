import { describe, expect, it } from 'vitest';
import { marksToGrade, isPass } from '../../../src/utils/grades';

describe('marksToGrade', () => {
  it.each([[100, 'A'], [75, 'A'], [74, 'B'], [65, 'B'], [64, 'C'], [50, 'C'], [49, 'D'], [35, 'D'], [34, 'F'], [0, 'F']])(
    'score %i/100 -> %s', (score, grade) => expect(marksToGrade(score, 100)).toBe(grade));
  it('scales with max marks', () => expect(marksToGrade(15, 20)).toBe('A'));
  it('rejects out-of-range scores', () => {
    expect(() => marksToGrade(101, 100)).toThrow();
    expect(() => marksToGrade(-1, 100)).toThrow();
    expect(() => marksToGrade(1, 0)).toThrow();
  });
  it('isPass uses 35%', () => { expect(isPass(35, 100)).toBe(true); expect(isPass(34, 100)).toBe(false); });
});
