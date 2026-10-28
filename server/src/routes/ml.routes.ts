import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/ml.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const r = Router();
r.use(requireAuth);
r.get('/health', requireRole('ADMIN', 'TEACHER'), c.health);
r.post('/predict', requireRole('ADMIN', 'TEACHER'), validate({ body: z.object({ studentId: z.string().min(1) }) }), c.predict);
r.get('/explain/:studentId', requireRole('ADMIN', 'TEACHER'), validate({ params: z.object({ studentId: z.string() }) }), c.explain);
r.get('/at-risk', requireRole('ADMIN', 'TEACHER'), c.atRisk);
r.post('/train', requireRole('ADMIN'), c.train);
r.get('/evaluate', requireRole('ADMIN'), c.evaluate);
export default r;
