import { asyncHandler as h } from '../utils/asyncHandler';
import { badRequest } from '../utils/httpError';
import { ok } from '../utils/respond';
import * as auth from '../services/auth.service';
import { getUser } from '../services/user.service';

export const register = h(async (req, res) => ok(res, await auth.register(req.body), 201));
export const login = h(async (req, res) => ok(res, await auth.login(req.body.email, req.body.password)));
export const refresh = h(async (req, res) => ok(res, await auth.refresh(req.body.refreshToken)));
export const logout = h(async (_req, res) => ok(res, { message: 'Signed out' })); // tokens are stateless; client discards them
export const forgot = h(async (req, res) => {
  await auth.forgotPassword(req.body.email);
  ok(res, { message: 'If that email is registered, a reset link has been sent.' });
});
export const reset = h(async (req, res) => {
  await auth.resetPassword(req.params.token, req.body.password);
  ok(res, { message: 'Password updated. You can sign in now.' });
});
export const me = h(async (req, res) => ok(res, await getUser(req.user!.id)));
export const updateMe = h(async (req, res) => ok(res, await auth.updateMe(req.user!.id, req.body)));
export const avatar = h(async (req, res) => {
  if (!req.file) throw badRequest('Choose an image to upload');
  ok(res, await auth.setAvatar(req.user!.id, req.file.filename));
});
export const changePassword = h(async (req, res) => {
  await auth.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  ok(res, { message: 'Password changed' });
});
