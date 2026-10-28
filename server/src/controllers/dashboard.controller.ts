import { asyncHandler as h } from '../utils/asyncHandler';
import { ok } from '../utils/respond';
import * as svc from '../services/dashboard.service';

export const admin = h(async (_req, res) => ok(res, await svc.adminDashboard()));
export const teacher = h(async (req, res) => ok(res, await svc.teacherDashboard(req.user!)));
export const student = h(async (req, res) => ok(res, await svc.studentDashboard(req.user!)));
export const stats = h(async (req, res) => ok(res, await svc.stats(req.user!)));
export const top = h(async (req, res) => ok(res, await svc.topPerformers(req.user!)));
export const atRisk = h(async (req, res) => ok(res, await svc.atRisk(req.user!)));
