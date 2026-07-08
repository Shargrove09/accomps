"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PendingStatus } from "@/generated/prisma/client";

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

/** True when a Prisma error is a unique-constraint violation (P2002). */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

/** Find an existing category by name, or create one with a random color. */
async function findOrCreateCategory(name: string) {
  const existing = await db.category.findUnique({ where: { name } });
  if (existing) return existing;

  return db.category.create({
    data: { name, color: getRandomColor() },
  });
}

/** Find an existing tag by name, or create one with a random color. */
async function findOrCreateTag(name: string) {
  const existing = await db.tag.findUnique({ where: { name } });
  if (existing) return existing;

  return db.tag.create({
    data: { name, color: getRandomColor() },
  });
}

/** Create AccomplishmentTag links for a set of tag names. */
async function linkTagsToAccomplishment(
  accomplishmentId: string,
  tagNames: string[],
) {
  for (const tagName of tagNames) {
    const tag = await findOrCreateTag(tagName);
    await db.accomplishmentTag.create({
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
}: {
  title: string;
  description?: string;
  category: string;
  tags: string[];
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
    const categoryRecord = await findOrCreateCategory(category);

    const accomplishment = await db.accomplishment.create({
      data: {
        title,
        description,
        date: new Date(),
        categoryId: categoryRecord.id,
      },
    });

    if (tags.length > 0) {
      await linkTagsToAccomplishment(accomplishment.id, tags);
    }

    revalidatePath("/");
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
}: {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  date?: Date;
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
    const categoryRecord = await findOrCreateCategory(category);

    // Update accomplishment
    await db.accomplishment.update({
      where: { id },
      data: {
        title,
        description,
        categoryId: categoryRecord.id,
        ...(date && { date }),
      },
    });

    // Replace tag associations: delete existing, then create new
    await db.accomplishmentTag.deleteMany({
      where: { accomplishmentId: id },
    });

    if (tags.length > 0) {
      await linkTagsToAccomplishment(id, tags);
    }

    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/tags");

    const updatedAccomplishment = await db.accomplishment.findUnique({
      where: { id },
      include: accomplishmentInclude,
    });

    return { success: true, data: updatedAccomplishment };
  } catch (error) {
    console.error("Error updating accomplishment:", error);
    return { success: false, error: "Failed to update accomplishment" };
  }
}

export async function deleteAccomplishment(id: string) {
  try {
    // Delete associated accomplishmentTags first
    await db.accomplishmentTag.deleteMany({
      where: { accomplishmentId: id },
    });

    // Delete the accomplishment
    await db.accomplishment.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/tags");
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

    revalidatePath("/");
    revalidatePath("/categories");
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

    revalidatePath("/");
    revalidatePath("/categories");
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

    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/calendar");
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

    revalidatePath("/");
    revalidatePath("/tags");
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

    revalidatePath("/");
    revalidatePath("/tags");
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

    revalidatePath("/");
    revalidatePath("/tags");
    return { success: true };
  } catch (error) {
    console.error("Error merging tags:", error);
    return { success: false, error: "Failed to merge tags" };
  }
}

export async function createPendingAccomplishment({
  title,
  description,
  category,
  tags,
  rawInput,
  source,
  confidence,
  status = PendingStatus.QUEUED,
  reasoning,
  errorMessage,
}: {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  rawInput: string;
  source?: string;
  confidence?: number;
  status?: PendingStatus;
  reasoning?: string;
  errorMessage?: string;
}) {
  try {
    const pending = await db.pendingAccomplishment.create({
      data: {
        title,
        description,
        category,
        tags: tags ?? [],
        rawInput,
        source,
        confidence: confidence ?? 0,
        status,
        reasoning,
        errorMessage,
      },
    });
    return { success: true, data: pending };
  } catch (error) {
    console.error("Error creating pending accomplishment:", error);
    return { success: false, error: "Failed to queue pending accomplishment" };
  }
}

export async function approvePendingAccomplishment({
  id,
  reviewer,
  reviewerNotes,
  fallbackCategory = "General",
}: {
  id: string;
  reviewer?: string;
  reviewerNotes?: string;
  fallbackCategory?: string;
}) {
  try {
    const pending = await db.pendingAccomplishment.findUnique({
      where: { id },
    });

    if (!pending) {
      return { success: false, error: "Pending accomplishment not found" };
    }

    if (pending.status !== PendingStatus.QUEUED) {
      return {
        success: false,
        error: "Pending accomplishment already processed",
      };
    }

    const result = await addAccomplishment({
      title: pending.title ?? pending.rawInput.slice(0, 120),
      description: pending.description ?? undefined,
      category: pending.category ?? fallbackCategory,
      tags: pending.tags.length > 0 ? pending.tags : ["pending-approved"],
    });

    if (!result.success) {
      return result;
    }

    await db.pendingAccomplishment.update({
      where: { id },
      data: {
        status: PendingStatus.APPROVED,
        reviewerNotes,
        processedBy: reviewer,
        approvedAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error("Error approving pending accomplishment:", error);
    return {
      success: false,
      error: "Failed to approve pending accomplishment",
    };
  }
}
