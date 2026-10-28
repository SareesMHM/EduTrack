import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok } from '../utils/respond';
import * as svc from '../services/marks.service';

export const bulk = h(async (req, res) => ok(res, await svc.bulkEnter(req.user!, req.body.examId, req.body.marks), 201));
export const update = h(async (req, res) => ok(res, await svc.updateMark(req.user!, req.params.id, req.body.score)));
export const remove = h(async (req, res) => { await svc.deleteMark(req.user!, req.params.id); noContent(res); });
export const byExam = h(async (req, res) => ok(res, await svc.byExam(req.user!, req.params.examId)));
export const byStudent = h(async (req, res) => ok(res, await svc.byStudent(req.user!, req.params.studentId)));
