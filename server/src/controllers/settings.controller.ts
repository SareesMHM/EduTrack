import { asyncHandler as h } from '../utils/asyncHandler';
import { ok } from '../utils/respond';
import * as svc from '../services/settings.service';

export const get = h(async (_req, res) => ok(res, await svc.getSettings()));
export const update = h(async (req, res) => ok(res, await svc.updateSettings(req.body)));
