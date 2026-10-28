import { Link } from 'react-router-dom';

const REGISTER: [string, 'P' | 'L' | 'A'][] = [
  ['Nimal Perera', 'P'], ['Kamala Silva', 'P'], ['Sunil Fernando', 'L'], ['Anusha Jayasinghe', 'P'],
  ['Ravi Kumar', 'A'], ['Dilini Weerasinghe', 'P'], ['Tharindu Bandara', 'P'],
];
const MARK = { P: 'bg-good text-white', L: 'bg-warn text-white', A: 'bg-bad text-white' };

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <img src="/logo.svg" alt="EduTrack" className="h-8" />
        <nav className="flex gap-2"><Link to="/login" className="btn-ghost">Sign in</Link><Link to="/register" className="btn-primary">Create student account</Link></nav>
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
        <section>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">The class register, the mark book and the report card in one place.</h1>
          <p className="mt-4 max-w-prose text-lg text-ink-soft">
            EduTrack replaces paper registers and scattered spreadsheets. Teachers take attendance in under a minute,
            enter marks with grades worked out for them, and students see published results and their own attendance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">Sign in</Link>
            <Link to="/forgot-password" className="btn-ghost">Forgot your password?</Link>
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-ink-soft sm:grid-cols-3">
            <li><strong className="block text-ink">Admins</strong>manage students, teachers, classes and reports</li>
            <li><strong className="block text-ink">Teachers</strong>mark attendance, enter marks, spot students who need help</li>
            <li><strong className="block text-ink">Students</strong>check attendance and published results</li>
          </ul>
        </section>
        <section aria-label="Sample class register" className="card p-0 shadow-sm">
          <div className="border-b border-paper-line px-5 py-3"><p className="font-semibold">Grade 10 · 10-A</p><p className="text-sm text-ink-soft">Today’s register (sample)</p></div>
          <ul className="divide-y divide-paper-line">
            {REGISTER.map(([n, s]) => (
              <li key={n} className="flex items-center justify-between px-5 py-2.5 text-sm">
                <span>{n}</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${MARK[s]}`} aria-label={{ P: 'Present', L: 'Late', A: 'Absent' }[s]}>{s}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
