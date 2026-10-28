export interface MarkRow { studentId: string; fullName: string; markId: string | null; score: number | null; grade: string | null }
export interface ExamMarks { exam: { id: string; title: string; maxMarks: number; published: boolean; classId: string }; rows: MarkRow[] }
export interface ExamSummary {
  exam: { id: string; title: string; subject: string; class: string; maxMarks: number; published: boolean };
  count: number; average: number | null; highest: number | null; lowest: number | null; passRate: number | null;
  distribution: Record<string, number>;
}
