import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok } from '../utils/respond';
import * as svc from '../services/subject.service';

export const list = h(async (_req, res) => ok(res, await svc.listSubjects()));
export const get = h(async (req, res) => ok(res, await svc.getSubject(req.params.id)));
export const create = h(async (req, res) => ok(res, await svc.createSubject(req.body), 201));
export const update = h(async (req, res) => ok(res, await svc.updateSubject(req.params.id, req.body)));
export const remove = h(async (req, res) => { await svc.deleteSubject(req.params.id); noContent(res); });
