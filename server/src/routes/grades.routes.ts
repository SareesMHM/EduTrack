import { Router } from 'express';
import * as c from '../controllers/grade.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import { gradeBody } from '../validators/subject.validator';

const r = Router();
// Grades are needed by the public registration form, so listing is open.
r.get('/', c.list);
r.use(requireAuth, requireRole('ADMIN'));
r.post('/', validate({ body: gradeBody }), c.create);
r.patch('/:id', validate({ params: idParam, body: gradeBody.partial() }), c.update);
r.delete('/:id', validate({ params: idParam }), c.remove);
export default r;
