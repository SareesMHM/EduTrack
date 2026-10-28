import { Link } from 'react-router-dom';
export default function NotFound() {
  return <ErrorPage code="404" title="Page not found" hint="The page may have moved, or the link is mistyped." />;
}
export function ErrorPage({ code, title, hint }: { code: string; title: string; hint: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <p className="text-5xl font-bold text-brand">{code}</p>
      <h1>{title}</h1>
      <p className="max-w-sm text-ink-soft">{hint}</p>
      <Link to="/" className="btn-primary mt-4">Go to home</Link>
    </div>
  );
}
