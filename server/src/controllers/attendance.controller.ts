import { asyncHandler as h } from '../utils/asyncHandler';
import { csv, ok } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/attendance.service';

export const bulk = h(async (req, res) => ok(res, await svc.bulkMark(req.user!, req.body), 201));
export const update = h(async (req, res) => ok(res, await svc.updateRecord(req.user!, req.params.id, req.body)));
export const byClass = h(async (req, res) => ok(res, await svc.byClass(req.user!, req.params.classId, getQuery(req))));
export const byStudent = h(async (req, res) => ok(res, await svc.byStudent(req.user!, req.params.studentId, getQuery(req))));
export const history = h(async (req, res) => ok(res, await svc.history(req.user!, getQuery(req))));
export const classSummary = h(async (req, res) => ok(res, await svc.classSummary(req.user!, req.params.classId, getQuery(req))));
export const percentage = h(async (req, res) => ok(res, await svc.percentage(req.user!, req.params.studentId)));
export const low = h(async (req, res) => {
  const q = getQuery(req);
  ok(res, await svc.lowAttendance(req.user!, q.threshold, q.classId));
});
export const exportCsv = h(async (req, res) => csv(res, 'attendance.csv', await svc.exportCsv(req.user!, getQuery(req))));
