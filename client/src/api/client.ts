import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, Paginated } from '../types/api';
import { REFRESH_KEY, TOKEN_KEY } from '../utils/constants';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';
export const http = axios.create({ baseURL, timeout: 20000 });

export const tokens = {
  get access() { return localStorage.getItem(TOKEN_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  set(a: string, r?: string) { localStorage.setItem(TOKEN_KEY, a); if (r) localStorage.setItem(REFRESH_KEY, r); },
  clear() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); },
};

http.interceptors.request.use((cfg) => {
  if (tokens.access) cfg.headers.Authorization = `Bearer ${tokens.access}`;
  return cfg;
});

let refreshing: Promise<string> | null = null;
const refreshAccess = () =>
  (refreshing ??= axios
    .post(`${baseURL}/auth/refresh`, { refreshToken: tokens.refresh })
    .then((r) => { tokens.set(r.data.data.accessToken, r.data.data.refreshToken); return r.data.data.accessToken as string; })
    .finally(() => { refreshing = null; }));

const isAuthCall = (url?: string) => /\/auth\/(login|register|refresh|forgot-password|reset-password)/.test(url ?? '');

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError<any>) => {
    const cfg = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    if (error.response?.status === 401 && cfg && !cfg._retried && !isAuthCall(cfg.url) && tokens.refresh) {
      cfg._retried = true;
      try {
        cfg.headers.Authorization = `Bearer ${await refreshAccess()}`;
        return http(cfg);
      } catch { /* fall through to sign-out */ }
    }
    if (error.response?.status === 401 && !isAuthCall(cfg?.url)) {
      tokens.clear();
      if (!location.pathname.startsWith('/login')) location.assign('/login');
    }
    const body = error.response?.data;
    throw new ApiError(
      error.response?.status ?? 0,
      body?.message ?? (error.response ? 'Something went wrong' : 'Cannot reach the server. Check your connection.'),
      body?.errors ?? [],
    );
  },
);

export const get = async <T>(url: string, params?: object) => (await http.get(url, { params })).data.data as T;
export const getPage = async <T>(url: string, params?: object) => (await http.get(url, { params })).data as Paginated<T>;
export const post = async <T>(url: string, body?: unknown) => (await http.post(url, body)).data.data as T;
export const patch = async <T>(url: string, body?: unknown) => (await http.patch(url, body)).data.data as T;
export const put = async <T>(url: string, body?: unknown) => (await http.put(url, body)).data.data as T;
export const del = async (url: string) => { await http.delete(url); };

export async function download(url: string, filename: string, params?: object) {
  const res = await http.get(url, { params, responseType: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(res.data);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
