import { Link } from 'react-router-dom';
import { Exam } from '../../types/exam';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';

export default function ExamCard({ exam, to }: { exam: Exam; to?: string }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{exam.title}</p>
          <p className="text-sm text-ink-soft">{exam.subject.name} · {exam.class.name}</p>
        </div>
        <Badge tone={exam.published ? 'good' : 'neutral'}>{exam.published ? 'Published' : 'Draft'}</Badge>
      </div>
      <p className="mt-2 text-sm text-ink-soft">{formatDate(exam.date)} · out of {exam.maxMarks}</p>
    </>
  );
  return to ? <Link to={to} className="card block hover:border-brand">{inner}</Link> : <div className="card">{inner}</div>;
}
