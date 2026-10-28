import { Router } from 'express';
import * as c from '../controllers/teacher.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam, pageQuery } from '../validators/query.validator';
import { updateUserBody } from '../validators/user.validator';
import * as v from '../validators/teacher.validator';

const r = Router();
r.use(requireAuth);
r.get('/me/classes', requireRole('TEACHER'), c.myClasses);
r.get('/', requireRole('ADMIN'), validate({ query: pageQuery }), c.list);
r.get('/:id', requireRole('ADMIN'), validate({ params: idParam }), c.get);
r.patch('/:id', requireRole('ADMIN'), validate({ params: idParam, body: updateUserBody }), c.update);
r.put('/:id/classes', requireRole('ADMIN'), validate({ params: idParam, body: v.assignClassesBody }), c.assignClasses);
r.put('/:id/subjects', requireRole('ADMIN'), validate({ params: idParam, body: v.assignSubjectsBody }), c.assignSubjects);
export default r;
