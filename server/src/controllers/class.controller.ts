import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/class.service';

export const list = h(async (req, res) => ok(res, await svc.listClasses(req.user!, getQuery(req))));
export const get = h(async (req, res) => ok(res, await svc.getClass(req.user!, req.params.id)));
export const create = h(async (req, res) => ok(res, await svc.createClass(req.body), 201));
export const update = h(async (req, res) => ok(res, await svc.updateClass(req.params.id, req.body)));
export const remove = h(async (req, res) => { await svc.deleteClass(req.params.id); noContent(res); });
export const students = h(async (req, res) => ok(res, await svc.classStudents(req.user!, req.params.id)));
export const setSubjects = h(async (req, res) => ok(res, await svc.setClassSubjects(req.params.id, req.body.subjectIds)));
