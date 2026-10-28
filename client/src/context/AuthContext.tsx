import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api';
import { tokens } from '../api/client';
import { AuthResult, LoginInput, RegisterInput } from '../types/auth';
import { User } from '../types/user';

export interface AuthState {
  user: User | null;
  loading: boolean;
  login: (i: LoginInput) => Promise<User>;
  register: (i: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (u: User) => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!tokens.access);

  useEffect(() => {
    if (!tokens.access) return;
    authApi.me().then(setUser).catch(() => tokens.clear()).finally(() => setLoading(false));
  }, []);

  const accept = useCallback((r: AuthResult) => {
    tokens.set(r.accessToken, r.refreshToken);
    setUser(r.user);
    return r.user;
  }, []);

  const value = useMemo<AuthState>(() => ({
    user, loading, setUser,
    login: async (i) => accept(await authApi.login(i)),
    register: async (i) => accept(await authApi.register(i)),
    logout: async () => { try { await authApi.logout(); } catch { /* ignore */ } tokens.clear(); setUser(null); },
  }), [user, loading, accept]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
