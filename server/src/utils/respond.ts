import { Response } from 'express';

export const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ data });
export const okPage = (res: Response, r: { items: unknown; meta: unknown }) => res.json({ data: r.items, meta: r.meta });
export const noContent = (res: Response) => res.status(204).end();
export const csv = (res: Response, name: string, body: string) => {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  res.send(body);
};
