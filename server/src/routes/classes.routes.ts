import { Router } from 'express';
import * as c from '../controllers/class.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/class.validator';

const r = Router();
r.use(requireAuth);
r.get('/', validate({ query: v.classListQuery }), c.list);
r.post('/', requireRole('ADMIN'), validate({ body: v.classBody }), c.create);
r.get('/:id', validate({ params: idParam }), c.get);
r.patch('/:id', requireRole('ADMIN'), validate({ params: idParam, body: v.classUpdateBody }), c.update);
r.delete('/:id', requireRole('ADMIN'), validate({ params: idParam }), c.remove);
r.get('/:id/students', requireRole('ADMIN', 'TEACHER'), validate({ params: idParam }), c.students);
r.put('/:id/subjects', requireRole('ADMIN'), validate({ params: idParam, body: v.classSubjectsBody }), c.setSubjects);
export default r;
