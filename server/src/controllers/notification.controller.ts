import { asyncHandler as h } from '../utils/asyncHandler';
import { ok } from '../utils/respond';
import * as svc from '../services/notification.service';

export const list = h(async (req, res) => ok(res, await svc.listNotifications(req.user!.id, req.query.unread === 'true')));
export const read = h(async (req, res) => { await svc.markRead(req.user!.id, req.params.id); ok(res, { id: req.params.id, read: true }); });
export const readAll = h(async (req, res) => { await svc.markAllRead(req.user!.id); ok(res, { message: 'All marked as read' }); });
