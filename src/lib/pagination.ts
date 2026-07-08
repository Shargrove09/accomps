/** Pagination defaults/bounds shared across agent list endpoints. */
export const DEFAULT_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 50;

/**
 * Parse `page`/`pageSize` from a URLSearchParams into safe, bounded integers.
 * Guards against NaN (non-numeric input) and caps pageSize so a caller can't
 * request an unbounded result set.
 */
export function parsePagination(searchParams: URLSearchParams): {
  page: number;
  pageSize: number;
  skip: number;
} {
  const rawPage = parseInt(searchParams.get("page") ?? "", 10);
  const rawPageSize = parseInt(searchParams.get("pageSize") ?? "", 10);

  const page = Number.isFinite(rawPage) ? Math.max(1, rawPage) : 1;
  const pageSize = Number.isFinite(rawPageSize)
    ? Math.min(MAX_PAGE_SIZE, Math.max(1, rawPageSize))
    : DEFAULT_PAGE_SIZE;

  return { page, pageSize, skip: (page - 1) * pageSize };
}
