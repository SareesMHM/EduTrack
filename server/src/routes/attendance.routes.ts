import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/attendance.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireOwnership } from '../middleware/requireOwnership';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/attendance.validator';

const classParam = z.object({ classId: z.string().min(1) });
const studentParam = z.object({ studentId: z.string().min(1) });
const staff = requireRole('ADMIN', 'TEACHER');

const r = Router();
r.use(requireAuth);
r.post('/bulk', staff, validate({ body: v.bulkAttendanceBody }), c.bulk);
r.get('/history', staff, validate({ query: v.attendanceQuery }), c.history);
r.get('/low', staff, validate({ query: v.attendanceQuery }), c.low);
r.get('/export', staff, validate({ query: v.attendanceQuery }), c.exportCsv);
r.get('/class/:classId', staff, validate({ params: classParam, query: v.attendanceQuery }), c.byClass);
r.get('/summary/class/:classId', staff, validate({ params: classParam, query: v.attendanceQuery }), c.classSummary);
r.get('/student/:studentId', validate({ params: studentParam, query: v.attendanceQuery }), requireOwnership('studentId'), c.byStudent);
r.get('/percentage/:studentId', validate({ params: studentParam }), requireOwnership('studentId'), c.percentage);
r.patch('/:id', staff, validate({ params: idParam, body: v.updateAttendanceBody }), c.update);
export default r;
