import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/exam.service';

export const list = h(async (req, res) => ok(res, await svc.listExams(req.user!, getQuery(req))));
export const get = h(async (req, res) => ok(res, await svc.getExam(req.user!, req.params.id)));
export const create = h(async (req, res) => ok(res, await svc.createExam(req.user!, req.body), 201));
export const update = h(async (req, res) => ok(res, await svc.updateExam(req.user!, req.params.id, req.body)));
export const remove = h(async (req, res) => { await svc.deleteExam(req.user!, req.params.id); noContent(res); });
export const publish = h(async (req, res) => ok(res, await svc.setPublished(req.user!, req.params.id, true)));
export const unpublish = h(async (req, res) => ok(res, await svc.setPublished(req.user!, req.params.id, false)));
