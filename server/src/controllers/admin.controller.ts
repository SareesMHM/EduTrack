import { asyncHandler as h } from '../utils/asyncHandler';
import { noContent, ok, okPage } from '../utils/respond';
import { getQuery } from '../middleware/validate';
import * as users from '../services/user.service';

export const list = h(async (req, res) => okPage(res, await users.listUsers(getQuery(req))));
export const get = h(async (req, res) => ok(res, await users.getUser(req.params.id)));
export const create = h(async (req, res) => ok(res, await users.createUser(req.user!.id, req.body), 201));
export const update = h(async (req, res) => ok(res, await users.updateUser(req.user!.id, req.params.id, req.body)));
export const status = h(async (req, res) => ok(res, await users.setStatus(req.user!.id, req.params.id, req.body.isActive)));
export const resetPassword = h(async (req, res) => {
  await users.adminResetPassword(req.user!.id, req.params.id, req.body.newPassword);
  ok(res, { message: 'Password reset' });
});
export const remove = h(async (req, res) => {
  await users.deleteUser(req.user!.id, req.params.id);
  noContent(res);
});
export const bulkImport = h(async (req, res) => ok(res, await users.bulkImport(req.user!.id, req.body.users), 201));
