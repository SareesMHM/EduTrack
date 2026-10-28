import { asyncHandler as h } from '../utils/asyncHandler';
import { ok, okPage } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/teacher.service';
import { updateUser } from '../services/user.service';

export const list = h(async (req, res) => okPage(res, await svc.listTeachers(getQuery(req))));
export const get = h(async (req, res) => ok(res, await svc.getTeacher(req.params.id)));
export const update = h(async (req, res) => {
  await updateUser(req.user!.id, req.params.id, req.body);
  ok(res, await svc.getTeacher(req.params.id));
});
export const assignClasses = h(async (req, res) => ok(res, await svc.assignClasses(req.user!.id, req.params.id, req.body.classIds)));
export const assignSubjects = h(async (req, res) => ok(res, await svc.assignSubjects(req.user!.id, req.params.id, req.body.subjectIds)));
export const myClasses = h(async (req, res) => ok(res, await svc.myClasses(req.user!.id)));
