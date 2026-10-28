import { asyncHandler as h } from '../utils/asyncHandler';
import { csv, ok } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as svc from '../services/report.service';

export const search = h(async (req, res) => ok(res, await svc.globalSearch(req.user!, String(getQuery(req).q ?? ''))));
export const studentsCsv = h(async (req, res) => csv(res, 'students.csv', await svc.exportStudentsCsv(req.user!)));
export const term = h(async (req, res) => ok(res, await svc.termReport(req.user!, getQuery(req))));
export const termCsv = h(async (req, res) => csv(res, 'term-report.csv', await svc.termReportCsv(req.user!, getQuery(req))));
