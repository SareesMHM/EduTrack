import { get, post } from './client';

export interface Prediction {
  studentId: string; prediction: 'AT_RISK' | 'ON_TRACK'; probability: number; confidence: number;
  modelVersion: string; disclaimer: string; features: Record<string, number>;
}
export const predict = (studentId: string) => post<Prediction>('/ml/predict', { studentId });
export const explain = (studentId: string) => get<{ probability: number; contributions: Record<string, number>; method: string }>(`/ml/explain/${studentId}`);
export const atRiskPredictions = () => get<(Partial<Prediction> & { fullName: string; class?: string; studentId: string })[]>('/ml/at-risk');
export const health = () => get<{ status: string; modelLoaded: boolean }>('/ml/health');
