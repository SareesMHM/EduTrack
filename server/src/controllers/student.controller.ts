import { asyncHandler as h } from '../utils/asyncHandler';
import { ok, okPage } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/student.service';
import { updateMe } from '../services/auth.service';

export const list = h(async (req, res) => okPage(res, await svc.listStudents(req.user!, getQuery(req))));
export const get = h(async (req, res) => ok(res, await svc.getStudent(req.user!, req.params.id)));
export const update = h(async (req, res) => ok(res, await svc.updateStudent(req.user!, req.params.id, req.body)));
export const transfer = h(async (req, res) => ok(res, await svc.transferClass(req.user!.id, req.params.id, req.body.classId)));
export const attendance = h(async (req, res) => ok(res, await svc.attendanceSummary(req.user!, req.params.id)));
export const results = h(async (req, res) => ok(res, await svc.resultsSummary(req.user!, req.params.id)));
export const myProfile = h(async (req, res) => ok(res, await svc.getStudent(req.user!, req.user!.id)));
export const updateMyContact = h(async (req, res) => ok(res, await updateMe(req.user!.id, req.body)));
