export interface AttendanceLike {
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

/**
 * PRESENT and LATE count as attended. EXCUSED days are removed from the
 * denominator. Returns 0..100 rounded to 1 decimal; 100 when there are no counted days.
 */
export function attendancePercentage(records: AttendanceLike[]): number {
  const counted = records.filter((r) => r.status !== 'EXCUSED');
  if (counted.length === 0) return 100;
  const attended = counted.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length;
  return Math.round((attended / counted.length) * 1000) / 10;
}

export function summarise(records: AttendanceLike[]) {
  const count = (s: AttendanceLike['status']) => records.filter((r) => r.status === s).length;
  return {
    total: records.length,
    present: count('PRESENT'),
    absent: count('ABSENT'),
    late: count('LATE'),
    excused: count('EXCUSED'),
    percentage: attendancePercentage(records),
  };
}
