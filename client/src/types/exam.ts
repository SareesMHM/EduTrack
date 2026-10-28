export interface Exam {
  id: string; title: string; subjectId: string; classId: string; date: string; maxMarks: number; published: boolean;
  subject: { id: string; name: string; code: string };
  class: { id: string; name: string; grade: { name: string } };
  _count: { marks: number };
}
