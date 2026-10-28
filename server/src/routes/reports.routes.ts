import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/report.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { dateString } from '../validators/query.validator';

const termQuery = z.object({ classId: z.string().optional(), from: dateString.optional(), to: dateString.optional() });
const r = Router();
r.use(requireAuth, requireRole('ADMIN', 'TEACHER'));
r.get('/search', validate({ query: z.object({ q: z.string().trim().min(2).max(100) }) }), c.search);
r.get('/export/students', c.studentsCsv);
r.get('/term', validate({ query: termQuery }), c.term);
r.get('/export/term', validate({ query: termQuery }), c.termCsv);
export default r;
