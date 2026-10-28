export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export interface AttendanceRecord {
  id: string; studentId: string; classId: string; date: string; status: AttendanceStatus; note?: string | null;
  student?: { id: string; fullName: string }; class?: { id: string; name: string };
}
export interface LowAttendanceRow { studentId: string; fullName: string; className?: string; percentage: number; total: number; absent: number }
