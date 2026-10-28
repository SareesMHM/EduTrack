import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/marks.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireOwnership } from '../middleware/requireOwnership';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/marks.validator';

const staff = requireRole('ADMIN', 'TEACHER');
const r = Router();
r.use(requireAuth);
r.post('/bulk', staff, validate({ body: v.bulkMarksBody }), c.bulk);
r.get('/exam/:examId', staff, validate({ params: z.object({ examId: z.string() }) }), c.byExam);
r.get('/student/:studentId', validate({ params: z.object({ studentId: z.string() }) }), requireOwnership('studentId'), c.byStudent);
r.patch('/:id', staff, validate({ params: idParam, body: v.updateMarkBody }), c.update);
r.delete('/:id', staff, validate({ params: idParam }), c.remove);
export default r;
