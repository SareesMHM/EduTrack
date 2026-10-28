import { useNavigate } from 'react-router-dom';
import { published } from '../../api/results.api';
import DataTable from '../../components/common/DataTable';
import { useApi } from '../../hooks/useApi';
import { GRADE_STYLE } from '../../utils/constants';
import { formatDate } from '../../utils/formatDate';

export default function Results() {
  const nav = useNavigate();
  const { data, isLoading } = useApi(['results', 'mine'], published);
  const avg = data?.length ? Math.round((data.reduce((a, r) => a + r.percentage, 0) / data.length) * 10) / 10 : null;
  return (
    <div className="space-y-4"><div className="flex items-end justify-between"><h1>My results</h1>{avg !== null && <p className="text-sm text-ink-soft">Average <strong className="text-ink">{avg}%</strong></p>}</div>
      <div className="card p-0"><DataTable rows={data} loading={isLoading} rowKey={(r) => r.examId} onRowClick={(r) => nav(`/student/results/${r.examId}`)} empty={{ title: 'No published results yet', hint: 'Results show up here when your teacher publishes them.' }}
        columns={[{ key: 'title', header: 'Exam', sortValue: (r) => r.title, render: (r) => <span className="font-medium">{r.title}</span> }, { key: 'subject', header: 'Subject' }, { key: 'date', header: 'Date', sortValue: (r) => r.date, render: (r) => formatDate(r.date) },
          { key: 'score', header: 'Score', render: (r) => `${r.score}/${r.maxMarks} (${r.percentage}%)` }, { key: 'grade', header: 'Grade', render: (r) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${GRADE_STYLE[r.grade]}`}>{r.grade}</span> }]} /></div>
    </div>
  );
}
