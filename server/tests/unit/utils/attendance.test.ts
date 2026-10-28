import { describe, expect, it } from 'vitest';
import { attendancePercentage, summarise } from '../../../src/utils/attendance';

const r = (...s: any[]) => s.map((status) => ({ status }));

describe('attendancePercentage', () => {
  it('counts present and late as attended', () => expect(attendancePercentage(r('PRESENT', 'LATE', 'ABSENT', 'ABSENT'))).toBe(50));
  it('excludes excused days from the denominator', () => expect(attendancePercentage(r('PRESENT', 'EXCUSED', 'EXCUSED', 'ABSENT'))).toBe(50));
  it('returns 100 with no counted days', () => { expect(attendancePercentage([])).toBe(100); expect(attendancePercentage(r('EXCUSED'))).toBe(100); });
  it('rounds to one decimal', () => expect(attendancePercentage(r('PRESENT', 'ABSENT', 'ABSENT'))).toBe(33.3));
  it('summarise returns counts', () => expect(summarise(r('PRESENT', 'ABSENT', 'LATE'))).toMatchObject({ total: 3, present: 1, absent: 1, late: 1, excused: 0 }));
});
