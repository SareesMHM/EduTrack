import { Router } from 'express';
import * as c from '../controllers/notification.controller';
import { requireAuth } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';

const r = Router();
r.use(requireAuth);
r.get('/', c.list);
r.patch('/read-all', c.readAll);
r.patch('/:id/read', validate({ params: idParam }), c.read);
export default r;
