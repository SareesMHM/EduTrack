import { Router } from 'express';
import * as c from '../controllers/admin.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { idParam } from '../validators/query.validator';
import * as v from '../validators/user.validator';

const r = Router();
r.use(requireAuth, requireRole('ADMIN'));
r.get('/', validate({ query: v.userListQuery }), c.list);
r.post('/', validate({ body: v.createUserBody }), c.create);
r.post('/bulk-import', validate({ body: v.bulkImportBody }), c.bulkImport);
r.get('/:id', validate({ params: idParam }), c.get);
r.patch('/:id', validate({ params: idParam, body: v.updateUserBody }), c.update);
r.patch('/:id/status', validate({ params: idParam, body: v.statusBody }), c.status);
r.post('/:id/reset-password', validate({ params: idParam, body: v.adminResetBody }), c.resetPassword);
r.delete('/:id', validate({ params: idParam }), c.remove);
export default r;
