import { asyncHandler as h } from '../utils/asyncHandler';
import { ok } from '../utils/respond';
import * as svc from '../services/result.service';
import { setPublished } from '../services/exam.service';

export const summary = h(async (req, res) => ok(res, await svc.examSummary(req.user!, req.params.examId)));
export const ranking = h(async (req, res) => ok(res, await svc.ranking(req.user!, req.params.examId)));
export const publish = h(async (req, res) => ok(res, await setPublished(req.user!, req.params.examId, true)));
export const published = h(async (req, res) => ok(res, await svc.publishedFor(req.user!, (req.query.studentId as string) || req.user!.id)));
export const reportCard = h(async (req, res) => ok(res, await svc.reportCard(req.user!, req.params.studentId)));
export const detail = h(async (req, res) => ok(res, await svc.examResultDetail(req.user!, req.params.studentId, req.params.examId)));
