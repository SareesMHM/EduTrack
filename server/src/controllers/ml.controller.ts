import { asyncHandler as h } from '../utils/asyncHandler';
import { ok } from '../utils/respond';
import * as svc from '../services/ml.service';

export const predict = h(async (req, res) => ok(res, await svc.predict(req.user!, req.body.studentId)));
export const explain = h(async (req, res) => ok(res, await svc.explain(req.user!, req.params.studentId)));
export const atRisk = h(async (req, res) => ok(res, await svc.atRiskPredictions(req.user!)));
export const train = h(async (_req, res) => ok(res, await svc.train()));
export const evaluate = h(async (_req, res) => ok(res, await svc.evaluate()));
export const health = h(async (_req, res) => ok(res, await svc.health()));
