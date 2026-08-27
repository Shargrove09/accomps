import type { Prisma } from "@/generated/prisma/client";

export const LIST_PAGE_SIZE = 25;

export type AccomplishmentSearch = {
  q: string;
  categories: string[];
  tags: string[];
  page: number;
};

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
    page: Number.isFinite(page) ? Math.max(1, page) : 1,
  };
}

export function isFiltered(search: AccomplishmentSearch): boolean {
  return Boolean(search.q || search.categories.length || search.tags.length);
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
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/accomplishments?${qs}` : "/accomplishments";
}
