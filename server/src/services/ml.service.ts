import { env } from '../config/env';
import { AuthUser } from '../types';
import { HttpError, notFound } from '../utils/httpError';
import { prisma } from '../config/db';
import { assertStudentAccess, manageableClassIds } from './access.service';
import { bulkFeatures, StudentFeatures } from './analytics.service';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${env.ML_SERVICE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new HttpError(503, 'The analytics service is not reachable right now');
  }
  if (!res.ok) throw new HttpError(res.status === 404 ? 404 : 502, `Analytics service error (${res.status})`);
  return res.json() as Promise<T>;
}

async function featuresFor(user: AuthUser, studentId: string): Promise<StudentFeatures> {
  await assertStudentAccess(user, studentId);
  const exists = await prisma.user.findFirst({ where: { id: studentId, role: 'STUDENT' }, select: { id: true } });
  if (!exists) throw notFound('Student not found');
  return (await bulkFeatures([studentId])).get(studentId)!;
}

export async function predict(user: AuthUser, studentId: string) {
  const features = await featuresFor(user, studentId);
  const result = await call<object>('/predict', { method: 'POST', body: JSON.stringify({ studentId, features }) });
  return { studentId, features, ...result, advisory: true };
}

export async function explain(user: AuthUser, studentId: string) {
  const features = await featuresFor(user, studentId);
  return call<object>('/explain', { method: 'POST', body: JSON.stringify({ studentId, features }) });
}

export async function atRiskPredictions(user: AuthUser) {
  const ids = await manageableClassIds(user);
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT', isActive: true, ...(ids ? { classId: { in: ids } } : {}) },
    select: { id: true, fullName: true, class: { select: { name: true } } },
  });
  const feats = await bulkFeatures(students.map((s) => s.id));
  const items = students.filter((s) => feats.get(s.id)!.examsTaken > 0);
  if (!items.length) return [];
  const preds = await call<{ results: { studentId: string; prediction: string; probability: number; confidence: number }[] }>('/predict/batch', {
    method: 'POST',
    body: JSON.stringify({ items: items.map((s) => ({ studentId: s.id, features: feats.get(s.id) })) }),
  });
  const byId = new Map(preds.results.map((r) => [r.studentId, r]));
  return items
    .map((s) => ({ studentId: s.id, fullName: s.fullName, class: s.class?.name, features: feats.get(s.id), ...byId.get(s.id) }))
    .filter((r) => r.prediction === 'AT_RISK')
    .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0));
}

export const train = () => call<object>('/train', { method: 'POST' });
export const evaluate = () => call<object>('/evaluate');
export const health = () => call<object>('/health');
