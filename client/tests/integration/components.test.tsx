import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DisclaimerBanner from '../../src/components/ml/DisclaimerBanner';
import ProtectedRoute from '../../src/components/auth/ProtectedRoute';

vi.mock('../../src/hooks/useAuth', () => ({ useAuth: vi.fn() }));
import { useAuth } from '../../src/hooks/useAuth';

const renderAt = (role: 'ADMIN' | 'STUDENT' | null) => {
  (useAuth as any).mockReturnValue({ user: role && { id: '1', role }, loading: false });
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route element={<ProtectedRoute roles={['ADMIN']} />}><Route path="/admin" element={<p>admin area</p>} /></Route>
        <Route path="/login" element={<p>login page</p>} /><Route path="/403" element={<p>forbidden page</p>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProtectedRoute', () => {
  it('lets the right role in', () => { renderAt('ADMIN'); expect(screen.getByText('admin area')).toBeInTheDocument(); });
  it('sends anonymous users to login', () => { renderAt(null); expect(screen.getByText('login page')).toBeInTheDocument(); });
  it('sends the wrong role to 403', () => { renderAt('STUDENT'); expect(screen.getByText('forbidden page')).toBeInTheDocument(); });
});

describe('DisclaimerBanner', () => {
  it('states the output is advisory', () => { render(<DisclaimerBanner />); expect(screen.getByRole('note')).toHaveTextContent(/advisory only/i); });
});
