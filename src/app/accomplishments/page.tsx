import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCategories, getExistingTags } from "@/lib/actions";
import { AccomplishmentsList } from "@/components/accomplishments-list";
import { AccomplishmentFilters } from "@/components/accomplishment-filters";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import {
  LIST_PAGE_SIZE,
  accomplishmentHref,
  buildAccomplishmentWhere,
  isFiltered,
  parseAccomplishmentSearch,
  type AccomplishmentSearch,
} from "@/lib/accomplishment-query";
import type { CategoryOption, TagOption } from "@/lib/types";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

async function Results({
  search,
  categories,
  tags,
}: {
  search: AccomplishmentSearch;
  categories: CategoryOption[];
  tags: TagOption[];
}) {
  const where = buildAccomplishmentWhere(search);

  const [accomplishments, total] = await Promise.all([
    db.accomplishment.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (search.page - 1) * LIST_PAGE_SIZE,
      take: LIST_PAGE_SIZE,
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    }),
    db.accomplishment.count({ where }),
  ]);

  // A page past the end is reachable by a stale link or by deleting rows.
  const pageCount = Math.max(1, Math.ceil(total / LIST_PAGE_SIZE));
  if (search.page > pageCount) {
    redirect(accomplishmentHref(search, pageCount));
  }

  return (
    <>
      <AccomplishmentsList
        initialAccomplishments={accomplishments}
        categories={categories}
        tags={tags}
        isFiltered={isFiltered(search)}
      />
      <Pagination search={search} total={total} />
    </>
  );
}

function Pagination({
  search,
  total,
}: {
  search: AccomplishmentSearch;
  total: number;
}) {
  const pageCount = Math.ceil(total / LIST_PAGE_SIZE);
  if (total === 0) return null;

  const first = (search.page - 1) * LIST_PAGE_SIZE + 1;
  const last = Math.min(search.page * LIST_PAGE_SIZE, total);

  const step =
    "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-kimberly text-mischka transition-colors hover:bg-east-bay hover:cursor-pointer";
  const stepOff =
    "inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-kimberly/40 text-kimberly cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-kimberly px-6 py-4">
      <span className="text-sm text-kimberly tabular-nums">
        {first}&ndash;{last} of {total}
      </span>

      <div className="flex items-center gap-2">
        {search.page > 1 ? (
          <Link
            href={accomplishmentHref(search, search.page - 1)}
            className={step}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Link>
        ) : (
          <span className={stepOff} aria-disabled="true">
            <ChevronLeft className="h-4 w-4" />
            Prev
          </span>
        )}

        <span className="text-sm text-kimberly tabular-nums">
          Page {search.page} of {pageCount}
        </span>

        {search.page < pageCount ? (
          <Link
            href={accomplishmentHref(search, search.page + 1)}
            className={step}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className={stepOff} aria-disabled="true">
            Next
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}

export default async function AccomplishmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = parseAccomplishmentSearch(await searchParams);
  const [categories, tags] = await Promise.all([
    getCategories(),
    getExistingTags(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-mischka mb-2">
          All Accomplishments
        </h1>
        <p className="text-kimberly">
          Browse, search, and filter all your accomplishments in one place.
        </p>
      </div>

      <div className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly">
        <div className="p-6 border-b border-kimberly">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-mischka">
              Your Achievements
            </h2>
          </div>
        </div>

        <AccomplishmentFilters categories={categories} tags={tags} />

        {/* Keyed so a filter change shows the skeleton instead of stale rows. */}
        <Suspense
          key={accomplishmentHref(search)}
          fallback={<div className="h-96 animate-pulse bg-east-bay/30" />}
        >
          <Results search={search} categories={categories} tags={tags} />
        </Suspense>
      </div>
    </div>
  );
}
