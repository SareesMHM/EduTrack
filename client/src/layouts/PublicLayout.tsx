import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper p-4">
      <Link to="/" className="mb-6"><img src="/logo.svg" alt="EduTrack" className="h-9" /></Link>
      <div className="card w-full max-w-md p-6 shadow-sm"><Outlet /></div>
    </div>
  );
}
