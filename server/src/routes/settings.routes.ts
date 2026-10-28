import { Router } from 'express';
import { z } from 'zod';
import * as c from '../controllers/settings.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';

const r = Router();
r.use(requireAuth);
r.get('/', c.get);
r.put('/', requireRole('ADMIN'), validate({ body: z.record(z.string().max(200)) }), c.update);
export default r;
