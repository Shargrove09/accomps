import type { Prisma } from "@/generated/prisma/client";
import { addDaysKey, keyToInstant } from "@/lib/analytics-period";

export const LIST_PAGE_SIZE = 25;

export type AccomplishmentSearch = {
  q: string;
  categories: string[];
  tags: string[];
  /** Inclusive local days, YYYY-MM-DD. */
  from: string | null;
  to: string | null;
  page: number;
};

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const day = (v: string | string[] | undefined) =>
  typeof v === "string" && DAY_RE.test(v) ? v : null;

type RawSearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

export function parseAccomplishmentSearch(
  searchParams: RawSearchParams,
): AccomplishmentSearch {
  const page = Number.parseInt(
    typeof searchParams.page === "string" ? searchParams.page : "",
    10,
  );

  return {
    q: (typeof searchParams.q === "string" ? searchParams.q : "").trim(),
    categories: toArray(searchParams.cat),
    tags: toArray(searchParams.tag),
    from: day(searchParams.from),
    to: day(searchParams.to),
    page: Number.isFinite(page) ? Math.max(1, page) : 1,
  };
}

export function isFiltered(search: AccomplishmentSearch): boolean {
  return Boolean(
    search.q || search.categories.length || search.tags.length || search.from || search.to,
  );
}

export function buildAccomplishmentWhere(
  search: AccomplishmentSearch,
): Prisma.AccomplishmentWhereInput {
  const AND: Prisma.AccomplishmentWhereInput[] = [];

  if (search.q) {
    AND.push({
      OR: [
        { title: { contains: search.q, mode: "insensitive" } },
        { description: { contains: search.q, mode: "insensitive" } },
      ],
    });
  }

  // Both lists match ANY, preserving the old client-side filter semantics.
  if (search.categories.length) {
    AND.push({ category: { name: { in: search.categories } } });
  }

  if (search.tags.length) {
    AND.push({ tags: { some: { tag: { name: { in: search.tags } } } } });
  }

  if (search.from) AND.push({ date: { gte: keyToInstant(search.from) } });
  if (search.to) AND.push({ date: { lt: keyToInstant(addDaysKey(search.to, 1)) } });

  return AND.length ? { AND } : {};
}

export function accomplishmentHref(
  search: AccomplishmentSearch,
  page: number = search.page,
): string {
  const params = new URLSearchParams();
  if (search.q) params.set("q", search.q);
  search.categories.forEach((c) => params.append("cat", c));
  search.tags.forEach((t) => params.append("tag", t));
  if (search.from) params.set("from", search.from);
  if (search.to) params.set("to", search.to);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/accomplishments?${qs}` : "/accomplishments";
}

/** Link to the entries logged between two local days, inclusive. */
export function accomplishmentRangeHref(from: string, to: string): string {
  return `/accomplishments?from=${from}&to=${to}`;
}
