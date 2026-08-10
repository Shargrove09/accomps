"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { UNKNOWN_CATEGORY } from "@/lib/api-response";

// ── Shared helpers ──────────────────────────────────────────────────────────

const RANDOM_COLORS = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#8B5CF6", // violet
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
];

function getRandomColor() {
  return RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
}

/**
 * Invalidate cached routes after a write that has already committed.
 *
 * revalidatePath throws when there's no request context (scripts, cron jobs,
 * some route handlers). Because these calls sit at the end of a try block, that
 * error would otherwise be caught and reported as a failed write — telling the
 * caller to retry an operation that already succeeded, which for a merge or a
 * create means applying it twice. A stale cache is by far the safer failure, so
 * swallow it and carry on.
 */
function revalidate(...paths: string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (error) {
      console.warn(`revalidatePath("${path}") failed (non-fatal):`, error);
    }
  }
}

/** True when a Prisma error is a unique-constraint violation (P2002). */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/**
 * Prisma client accepted by the tag/category helpers — either the singleton
 * `db` or an interactive-transaction client (`tx`), so callers can run these
 * inside `db.$transaction(...)`.
 */
type PrismaClientOrTx = Prisma.TransactionClient;

/**
 * Find an existing category by name, case-insensitively.
 *
 * The `@unique` on Category.name is case-sensitive, so `findUnique` happily lets
 * `work` become a second row next to `Work`. Matching case-insensitively here
 * collapses that whole duplicate class on every path — agent, API and web form.
 */
async function findCategoryByName(
  name: string,
  client: PrismaClientOrTx = db,
) {
  return client.category.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });
}

/** Find an existing tag by name (case-insensitive), or create one. */
async function findOrCreateTag(name: string, client: PrismaClientOrTx = db) {
  const existing = await client.tag.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });
  if (existing) return existing;

  return client.tag.create({
    data: { name, color: getRandomColor() },
  });
}

/**
 * Resolve a category name to its record, creating it only when explicitly allowed.
 *
 * Categories are a closed set by default: the agent API never passes
 * `allowCreate`, so an unrecognized category is refused rather than minted as a
 * side effect of recording an accomplishment. A category can't be deleted once
 * anything points at it (onDelete: Restrict), so junk here is expensive.
 * The web form opts in, because there a new category is a deliberate human act.
 */
async function resolveCategory(
  name: string,
  allowCreate: boolean,
  client: PrismaClientOrTx = db,
) {
  const existing = await findCategoryByName(name, client);
  if (existing) return { category: existing };

  if (!allowCreate) {
    const available = await client.category.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    });
    return {
      category: null,
      error: `'${name}' is not an existing category`,
      code: UNKNOWN_CATEGORY,
      availableCategories: available.map((c) => c.name),
    };
  }

  const created = await client.category.create({
    data: { name: name.trim(), color: getRandomColor() },
  });
  return { category: created };
}

/** Create AccomplishmentTag links for a set of tag names. */
async function linkTagsToAccomplishment(
  accomplishmentId: string,
  tagNames: string[],
  client: PrismaClientOrTx = db,
) {
  for (const tagName of tagNames) {
    const tag = await findOrCreateTag(tagName, client);
    await client.accomplishmentTag.create({
      data: { accomplishmentId, tagId: tag.id },
    });
  }
}

/** Standard include clause for accomplishments with all relationships. */
const accomplishmentInclude = {
  category: true,
  tags: { include: { tag: true } },
} as const;

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_TAGS = 20;

/** Validates string inputs for accomplishment creation/update. */
function validateAccomplishmentInput(input: {
  title: string;
  description?: string;
  category: string;
  tags: string[];
}): string | null {
  if (!input.title || !input.title.trim()) return "Title is required";
  if (input.title.length > MAX_TITLE_LENGTH)
    return `Title must be ${MAX_TITLE_LENGTH} characters or less`;
  if (!input.category || !input.category.trim()) return "Category is required";
  if (input.category.length > MAX_NAME_LENGTH)
    return `Category name must be ${MAX_NAME_LENGTH} characters or less`;
  if (input.description && input.description.length > MAX_DESCRIPTION_LENGTH)
    return `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`;
  if (input.tags.length > MAX_TAGS)
    return `At most ${MAX_TAGS} tags allowed`;
  for (const tag of input.tags) {
    if (!tag || !tag.trim()) return "Tag names cannot be empty";
    if (tag.length > MAX_NAME_LENGTH)
      return `Tag name must be ${MAX_NAME_LENGTH} characters or less`;
  }
  return null;
}

// ── Server Actions ──────────────────────────────────────────────────────────

export async function addAccomplishment({
  title,
  description,
  category,
  tags,
  allowNewCategory = false,
}: {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  /**
   * Opt in to creating the category if it doesn't exist. Defaults to false so
   * that any caller which hasn't thought about it fails closed; the web form
   * passes true because its "+ Create New Category" flow is an explicit choice.
   */
  allowNewCategory?: boolean;
}) {
  const validationError = validateAccomplishmentInput({
    title,
    description,
    category,
    tags,
  });
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const resolved = await resolveCategory(category, allowNewCategory);
    if (!resolved.category) {
      return {
        success: false,
        error: resolved.error,
        code: resolved.code,
        availableCategories: resolved.availableCategories,
      };
    }

    const accomplishment = await db.accomplishment.create({
      data: {
        title,
        description,
        date: new Date(),
        categoryId: resolved.category.id,
      },
    });

    if (tags.length > 0) {
      await linkTagsToAccomplishment(accomplishment.id, tags);
    }

    revalidate("/");
    return { success: true, id: accomplishment.id };
  } catch (error) {
    console.error("Error adding accomplishment:", error);
    return { success: false, error: "Failed to add accomplishment" };
  }
}

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getExistingTags() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getTagsWithAccomplishmentCount() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { accomplishments: true },
        },
      },
    });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getAccomplishment(id: string) {
  try {
    const accomplishment = await db.accomplishment.findUnique({
      where: { id },
      include: accomplishmentInclude,
    });
    return accomplishment;
  } catch (error) {
    console.error("Error fetching accomplishment:", error);
    return null;
  }
}

export async function updateAccomplishment({
  id,
  title,
  description,
  category,
  tags,
  date,
  allowNewCategory = false,
}: {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  date?: Date;
  /** See addAccomplishment — defaults to false so callers fail closed. */
  allowNewCategory?: boolean;
}) {
  const validationError = validateAccomplishmentInput({
    title,
    description,
    category,
    tags,
  });
  if (validationError) {
    return { success: false, error: validationError };
  }

  // Resolve the category before opening the transaction: an unknown category is
  // a refusal, not a failure, and there's nothing to roll back.
  const resolved = await resolveCategory(category, allowNewCategory);
  if (!resolved.category) {
    return {
      success: false,
      error: resolved.error,
      code: resolved.code,
      availableCategories: resolved.availableCategories,
    };
  }
  const categoryId = resolved.category.id;

  try {
    // Run the update + tag replacement atomically so a mid-way failure can't
    // leave the accomplishment with a partially-rebuilt tag set.
    const updatedAccomplishment = await db.$transaction(async (tx) => {
      await tx.accomplishment.update({
        where: { id },
        data: {
          title,
          description,
          categoryId,
          ...(date && { date }),
        },
      });

      // Replace tag associations: delete existing, then create new
      await tx.accomplishmentTag.deleteMany({
        where: { accomplishmentId: id },
      });

      if (tags.length > 0) {
        await linkTagsToAccomplishment(id, tags, tx);
      }

      return tx.accomplishment.findUnique({
        where: { id },
        include: accomplishmentInclude,
      });
    });

    revalidate("/", "/calendar", "/tags");

    return { success: true, data: updatedAccomplishment };
  } catch (error) {
    console.error("Error updating accomplishment:", error);
    return { success: false, error: "Failed to update accomplishment" };
  }
}

export async function deleteAccomplishment(id: string) {
  try {
    // AccomplishmentTag rows cascade-delete via the schema relation
    // (onDelete: Cascade), so a single delete atomically removes the
    // accomplishment and its tag links.
    await db.accomplishment.delete({
      where: { id },
    });

    revalidate("/", "/calendar", "/tags");
    return { success: true };
  } catch (error) {
    console.error("Error deleting accomplishment:", error);
    return { success: false, error: "Failed to delete accomplishment" };
  }
}

export async function getAccomplishmentsByTag(tag: string) {
  try {
    return await db.accomplishment.findMany({
      where: { tags: { some: { tag: { name: tag } } } },
      include: accomplishmentInclude,
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Error fetching accomplishments by tag:", error);
    return [];
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export type AccomplishmentStats = {
  totals: {
    total: number;
    inRange: number;
    thisWeek: number;
    categories: number;
    tags: number;
  };
  range: { startDate: string | null; endDate: string | null };
  byCategory: { category: string; count: number }[];
  byTag: { tag: string; count: number }[];
  trends: {
    perDay: { date: string; count: number }[];
    mostActiveDay: { date: string; count: number } | null;
    currentStreak: number;
  };
};

const EMPTY_STATS: AccomplishmentStats = {
  totals: { total: 0, inRange: 0, thisWeek: 0, categories: 0, tags: 0 },
  range: { startDate: null, endDate: null },
  byCategory: [],
  byTag: [],
  trends: { perDay: [], mostActiveDay: null, currentStreak: 0 },
};

/** UTC day bucket (YYYY-MM-DD) used for per-day trends and streak calc. */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Aggregate stats over an optional date range: core totals, per-category and
 * per-tag breakdowns, per-day trend, most-active day, and the current
 * consecutive-day logging streak (computed over the last ~year, independent of
 * the requested range). Returns zeroed stats on error so callers never throw.
 */
export async function getAccomplishmentStats({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
} = {}): Promise<AccomplishmentStats> {
  try {
    const rangeFilter: Prisma.AccomplishmentWhereInput =
      startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: startDate }),
              ...(endDate && { lte: endDate }),
            },
          }
        : {};

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const streakSince = new Date();
    streakSince.setDate(streakSince.getDate() - 366);

    const [
      total,
      inRange,
      thisWeek,
      totalCategories,
      totalTags,
      categoryGroups,
      tagGroups,
      rangeDates,
      streakRows,
    ] = await Promise.all([
      db.accomplishment.count(),
      db.accomplishment.count({ where: rangeFilter }),
      db.accomplishment.count({ where: { date: { gte: weekAgo } } }),
      db.category.count(),
      db.tag.count(),
      db.accomplishment.groupBy({
        by: ["categoryId"],
        where: rangeFilter,
        _count: { _all: true },
        orderBy: { _count: { categoryId: "desc" } },
      }),
      db.accomplishmentTag.groupBy({
        by: ["tagId"],
        where: { accomplishment: rangeFilter },
        _count: { _all: true },
        orderBy: { _count: { tagId: "desc" } },
      }),
      db.accomplishment.findMany({
        where: rangeFilter,
        select: { date: true },
        orderBy: { date: "asc" },
      }),
      db.accomplishment.findMany({
        where: { date: { gte: streakSince } },
        select: { date: true },
      }),
    ]);

    // Resolve category/tag ids → names for the breakdowns.
    const [categories, tags] = await Promise.all([
      db.category.findMany({
        where: { id: { in: categoryGroups.map((g) => g.categoryId) } },
        select: { id: true, name: true },
      }),
      db.tag.findMany({
        where: { id: { in: tagGroups.map((g) => g.tagId) } },
        select: { id: true, name: true },
      }),
    ]);
    const catName = new Map(categories.map((c) => [c.id, c.name]));
    const tagName = new Map(tags.map((t) => [t.id, t.name]));

    const byCategory = categoryGroups.map((g) => ({
      category: catName.get(g.categoryId) ?? "Unknown",
      count: g._count._all,
    }));
    const byTag = tagGroups.map((g) => ({
      tag: tagName.get(g.tagId) ?? "Unknown",
      count: g._count._all,
    }));

    // Per-day counts within the range.
    const perDayMap = new Map<string, number>();
    for (const row of rangeDates) {
      const key = dayKey(row.date);
      perDayMap.set(key, (perDayMap.get(key) ?? 0) + 1);
    }
    const perDay = [...perDayMap.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    const mostActiveDay = perDay.reduce<{ date: string; count: number } | null>(
      (max, d) => (d.count > (max?.count ?? 0) ? d : max),
      null,
    );

    // Current streak: walk backwards from today over distinct logged days.
    const daySet = new Set(streakRows.map((r) => dayKey(r.date)));
    let currentStreak = 0;
    const cursor = new Date();
    if (!daySet.has(dayKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1); // allow a streak that ended yesterday
    }
    while (daySet.has(dayKey(cursor))) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return {
      totals: {
        total,
        inRange,
        thisWeek,
        categories: totalCategories,
        tags: totalTags,
      },
      range: {
        startDate: startDate?.toISOString() ?? null,
        endDate: endDate?.toISOString() ?? null,
      },
      byCategory,
      byTag,
      trends: { perDay, mostActiveDay, currentStreak },
    };
  } catch (error) {
    console.error("Error computing accomplishment stats:", error);
    return EMPTY_STATS;
  }
}

// ── LLM description generation ────────────────────────────────────────────────

/**
 * Generate a concise one-sentence description for an accomplishment via the
 * Python LLM agent (POST AGENT_DESCRIPTION_URL). Mirrors the parseWithAgent
 * pattern in the Resend route. Always resolves — falls back to a deterministic
 * "{title} ({category})." string if the agent is unconfigured or unreachable,
 * so callers (web form, create fallback) never break on agent downtime.
 */
export async function generateDescription({
  title,
  category,
  tags,
  context,
}: {
  title: string;
  category?: string;
  tags?: string[];
  context?: string;
}): Promise<{ success: boolean; description: string; error?: string }> {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) {
    return { success: false, description: "", error: "Title is required" };
  }

  const fallback = category
    ? `${trimmedTitle} (${category}).`
    : `${trimmedTitle}.`;

  const agentUrl = process.env.AGENT_DESCRIPTION_URL;
  const agentApiKey = process.env.AGENT_API_KEY;
  if (!agentUrl || !agentApiKey) {
    return { success: true, description: fallback };
  }

  try {
    const res = await fetch(agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": agentApiKey,
      },
      body: JSON.stringify({ title: trimmedTitle, category, tags, context }),
    });

    if (!res.ok) {
      console.error("Description agent returned non-OK status", res.status);
      return { success: true, description: fallback };
    }

    const data = await res.json();
    const description =
      typeof data?.description === "string" && data.description.trim()
        ? data.description.trim()
        : fallback;
    return { success: true, description };
  } catch (error) {
    console.error("Error calling description agent:", error);
    return { success: true, description: fallback };
  }
}

// ── Category management ──────────────────────────────────────────────────────

export async function getCategoriesWithAccomplishmentCount() {
  try {
    return await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { accomplishments: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Deliberately create a category. This is the only path that mints one for the
 * agent — recording an accomplishment never does it as a side effect, so adding
 * to the taxonomy is always a distinct, separately-approved act.
 */
export async function createCategory({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) {
    return { success: false, error: "Category name cannot be empty" };
  }
  if (trimmed.length > MAX_NAME_LENGTH) {
    return {
      success: false,
      error: `Category name must be ${MAX_NAME_LENGTH} characters or less`,
    };
  }

  try {
    const existing = await findCategoryByName(trimmed);
    if (existing) {
      return {
        success: false,
        alreadyExists: true,
        data: existing,
        error: `Category '${existing.name}' already exists`,
      };
    }

    const category = await db.category.create({
      data: { name: trimmed, description, color: getRandomColor() },
    });

    revalidate("/", "/categories");
    return { success: true, data: category };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A category with that name already exists" };
    }
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory({
  id,
  name,
  description,
  color,
}: {
  id: string;
  name?: string;
  description?: string | null;
  color?: string | null;
}) {
  if (name !== undefined && !name.trim()) {
    return { success: false, error: "Category name cannot be empty" };
  }
  if (name && name.length > MAX_NAME_LENGTH) {
    return {
      success: false,
      error: `Category name must be ${MAX_NAME_LENGTH} characters or less`,
    };
  }

  try {
    const category = await db.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
      },
    });

    revalidate("/", "/categories");
    return { success: true, data: category };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A category with that name already exists" };
    }
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const count = await db.accomplishment.count({ where: { categoryId: id } });
    if (count > 0) {
      return {
        success: false,
        inUse: true,
        count,
        error: `Category is used by ${count} accomplishment${
          count === 1 ? "" : "s"
        }. Merge it into another category first.`,
      };
    }

    await db.category.delete({ where: { id } });

    revalidate("/", "/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

/** Reassign all accomplishments from sourceId to targetId, then delete source. */
export async function mergeCategory({
  sourceId,
  targetId,
}: {
  sourceId: string;
  targetId: string;
}) {
  if (sourceId === targetId) {
    return { success: false, error: "Cannot merge a category into itself" };
  }

  try {
    const target = await db.category.findUnique({ where: { id: targetId } });
    if (!target) {
      return { success: false, error: "Target category not found" };
    }

    await db.accomplishment.updateMany({
      where: { categoryId: sourceId },
      data: { categoryId: targetId },
    });
    await db.category.delete({ where: { id: sourceId } });

    revalidate("/", "/categories", "/calendar");
    return { success: true };
  } catch (error) {
    console.error("Error merging categories:", error);
    return { success: false, error: "Failed to merge categories" };
  }
}

// ── Tag management ───────────────────────────────────────────────────────────

export async function updateTag({
  id,
  name,
  description,
  color,
}: {
  id: string;
  name?: string;
  description?: string | null;
  color?: string | null;
}) {
  if (name !== undefined && !name.trim()) {
    return { success: false, error: "Tag name cannot be empty" };
  }
  if (name && name.length > MAX_NAME_LENGTH) {
    return {
      success: false,
      error: `Tag name must be ${MAX_NAME_LENGTH} characters or less`,
    };
  }

  try {
    const tag = await db.tag.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
      },
    });

    revalidate("/", "/tags");
    return { success: true, data: tag };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, error: "A tag with that name already exists" };
    }
    console.error("Error updating tag:", error);
    return { success: false, error: "Failed to update tag" };
  }
}

/** Delete a tag. The AccomplishmentTag join rows cascade away automatically,
 * so accomplishments themselves are never deleted — only their association. */
export async function deleteTag(id: string) {
  try {
    await db.tag.delete({ where: { id } });

    revalidate("/", "/tags");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: "Failed to delete tag" };
  }
}

/** Re-point all AccomplishmentTag rows from sourceId to targetId (deduping
 * against the (accomplishmentId, tagId) unique constraint), then delete source. */
export async function mergeTag({
  sourceId,
  targetId,
}: {
  sourceId: string;
  targetId: string;
}) {
  if (sourceId === targetId) {
    return { success: false, error: "Cannot merge a tag into itself" };
  }

  try {
    const target = await db.tag.findUnique({ where: { id: targetId } });
    if (!target) {
      return { success: false, error: "Target tag not found" };
    }

    const sourceLinks = await db.accomplishmentTag.findMany({
      where: { tagId: sourceId },
    });

    for (const link of sourceLinks) {
      const alreadyTagged = await db.accomplishmentTag.findUnique({
        where: {
          accomplishmentId_tagId: {
            accomplishmentId: link.accomplishmentId,
            tagId: targetId,
          },
        },
      });

      if (alreadyTagged) {
        // Accomplishment already carries the target tag — drop the duplicate link.
        await db.accomplishmentTag.delete({ where: { id: link.id } });
      } else {
        await db.accomplishmentTag.update({
          where: { id: link.id },
          data: { tagId: targetId },
        });
      }
    }

    await db.tag.delete({ where: { id: sourceId } });

    revalidate("/", "/tags");
    return { success: true };
  } catch (error) {
    console.error("Error merging tags:", error);
    return { success: false, error: "Failed to merge tags" };
  }
}

/**
 * Delete several tags at once, unlinking them from every accomplishment.
 *
 * The AccomplishmentTag.tagId FK is ON DELETE CASCADE, so dropping the Tag rows
 * removes the join rows for us — no per-tag cleanup loop needed.
 *
 * Tags only. Category is onDelete: Restrict, so the equivalent deleteMany over
 * categories would throw on the first one in use and roll back the whole batch.
 */
export async function deleteTags(ids: string[]) {
  const targetIds = [...new Set(ids)].filter(Boolean);
  if (targetIds.length === 0) {
    return { success: true, deleted: 0 };
  }

  try {
    const result = await db.tag.deleteMany({ where: { id: { in: targetIds } } });

    revalidate("/", "/tags");
    return { success: true, deleted: result.count };
  } catch (error) {
    console.error("Error deleting tags:", error);
    return { success: false, error: "Failed to delete tags" };
  }
}

/**
 * Merge several tags into one survivor, then delete the sources.
 *
 * Batched rather than a loop over mergeTag, because collapsing many sources at
 * once has a failure mode the single-source version can't hit. Given
 * @@unique([accomplishmentId, tagId]), a bare
 * `updateMany({ where: { tagId: { in: sourceIds } } })` breaks as soon as two
 * sources sit on the SAME accomplishment — which is common here (one entry
 * carries SDCC + Convention + SDCC experience + Panels). So we dedupe on two
 * axes: against links the target already has, AND against links earlier in this
 * same batch. mergeTag avoids the second case only because it re-queries
 * committed state per link, one source at a time.
 */
export async function mergeTags({
  sourceIds,
  targetId,
}: {
  sourceIds: string[];
  targetId: string;
}) {
  // Merging the target into itself would delete it; drop it from the sources.
  const sources = [...new Set(sourceIds)].filter((id) => id && id !== targetId);
  if (sources.length === 0) {
    return { success: false, error: "No tags to merge" };
  }

  try {
    const target = await db.tag.findUnique({ where: { id: targetId } });
    if (!target) {
      return { success: false, error: "Target tag not found" };
    }

    const counts = await db.$transaction(async (tx) => {
      const sourceLinks = await tx.accomplishmentTag.findMany({
        where: { tagId: { in: sources } },
      });
      const targetLinks = await tx.accomplishmentTag.findMany({
        where: { tagId: targetId },
        select: { accomplishmentId: true },
      });

      // Accomplishments already carrying the target. Grows as we go, so the
      // second and later sources on one accomplishment collapse instead of
      // colliding.
      const tagged = new Set(targetLinks.map((l) => l.accomplishmentId));
      const toRepoint: string[] = [];
      const toDrop: string[] = [];

      for (const link of sourceLinks) {
        if (tagged.has(link.accomplishmentId)) {
          toDrop.push(link.id);
        } else {
          tagged.add(link.accomplishmentId);
          toRepoint.push(link.id);
        }
      }

      if (toDrop.length > 0) {
        await tx.accomplishmentTag.deleteMany({ where: { id: { in: toDrop } } });
      }
      if (toRepoint.length > 0) {
        await tx.accomplishmentTag.updateMany({
          where: { id: { in: toRepoint } },
          data: { tagId: targetId },
        });
      }
      await tx.tag.deleteMany({ where: { id: { in: sources } } });

      return { merged: toRepoint.length, duplicatesDropped: toDrop.length };
    });

    revalidate("/", "/tags");
    return {
      success: true,
      targetName: target.name,
      tagsDeleted: sources.length,
      ...counts,
    };
  } catch (error) {
    console.error("Error bulk-merging tags:", error);
    return { success: false, error: "Failed to merge tags" };
  }
}
