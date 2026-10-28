export interface PageQuery {
  page?: number;
  limit?: number;
}

export function paginate(q: PageQuery) {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(100, Math.max(1, q.limit ?? 20));
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export const pageMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
