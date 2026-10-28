import { Router } from 'express';
import * as c from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const r = Router();
r.use(requireAuth);
r.get('/admin', requireRole('ADMIN'), c.admin);
r.get('/teacher', requireRole('TEACHER'), c.teacher);
r.get('/student', requireRole('STUDENT'), c.student);
r.get('/stats', requireRole('ADMIN', 'TEACHER'), c.stats);
r.get('/top-performers', requireRole('ADMIN', 'TEACHER'), c.top);
r.get('/at-risk', requireRole('ADMIN', 'TEACHER'), c.atRisk);
export default r;
