import { Response } from 'express';

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Slice an array and set HATEOAS Link header on the response.
 */
export function paginate<T>(
  items: T[],
  query: PaginationQuery,
  res: Response,
  baseUrl: string,
): Paginated<T> {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const data = items.slice((page - 1) * limit, page * limit);

  // Build Link header
  const links: string[] = [];
  const url = (p: number) => `<${baseUrl}?page=${p}&limit=${limit}>`;

  links.push(`${url(1)}; rel="first"`);
  links.push(`${url(totalPages)}; rel="last"`);
  if (page > 1) links.push(`${url(page - 1)}; rel="prev"`);
  if (page < totalPages) links.push(`${url(page + 1)}; rel="next"`);

  res.setHeader('Link', links.join(', '));
  res.setHeader('X-Total-Count', String(total));

  return { data, meta: { total, page, limit, totalPages } };
}
