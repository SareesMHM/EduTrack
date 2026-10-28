import { Router } from 'express';
import * as c from '../controllers/exam.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/exam.validator';

const staff = requireRole('ADMIN', 'TEACHER');
const r = Router();
r.use(requireAuth);
r.get('/', validate({ query: v.examListQuery }), c.list);
r.post('/', staff, validate({ body: v.examBody }), c.create);
r.get('/:id', validate({ params: idParam }), c.get);
r.patch('/:id', staff, validate({ params: idParam, body: v.examUpdateBody }), c.update);
r.delete('/:id', staff, validate({ params: idParam }), c.remove);
r.post('/:id/publish', staff, validate({ params: idParam }), c.publish);
r.post('/:id/unpublish', staff, validate({ params: idParam }), c.unpublish);
export default r;
