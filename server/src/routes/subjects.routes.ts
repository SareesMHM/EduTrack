import { Router } from 'express';
import * as c from '../controllers/subject.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/subject.validator';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.get('/:id', validate({ params: idParam }), c.get);
r.post('/', requireRole('ADMIN'), validate({ body: v.subjectBody }), c.create);
r.patch('/:id', requireRole('ADMIN'), validate({ params: idParam, body: v.subjectUpdateBody }), c.update);
r.delete('/:id', requireRole('ADMIN'), validate({ params: idParam }), c.remove);
export default r;
