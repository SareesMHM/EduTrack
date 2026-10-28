import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok } from '../utils/respond';
import * as svc from '../services/grade.service';

export const list = h(async (_req, res) => ok(res, await svc.listGrades()));
export const create = h(async (req, res) => ok(res, await svc.createGrade(req.body), 201));
export const update = h(async (req, res) => ok(res, await svc.updateGrade(req.params.id, req.body)));
export const remove = h(async (req, res) => { await svc.deleteGrade(req.params.id); noContent(res); });
