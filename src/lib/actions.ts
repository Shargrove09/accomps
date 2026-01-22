"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PendingStatus } from "@/generated/prisma/client";

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
  try {
    // Find or create category
    let categoryRecord = await db.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await db.category.create({
        data: {
          name: category,
          color: getRandomColor(),
        },
      });
    }

    // Create accomplishment
    const accomplishment = await db.accomplishment.create({
      data: {
        title,
        description,
        date: new Date(),
        categoryId: categoryRecord.id,
      },
    });

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        let tag = await db.tag.findUnique({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await db.tag.create({
            data: {
              name: tagName,
              color: getRandomColor(),
            },
          });
        }

        await db.accomplishmentTag.create({
          data: {
            accomplishmentId: accomplishment.id,
            tagId: tag.id,
          },
        });
      }
    }

    revalidatePath("/");
    return { success: true, id: accomplishment.id };
  } catch (error) {
    console.error("Error adding accomplishment:", error);
    return { success: false, error: "Failed to add accomplishment" };
  }
}

function getRandomColor() {
  const colors = [
    "#3B82F6", // blue
    "#10B981", // emerald
    "#8B5CF6", // violet
    "#F59E0B", // amber
    "#EF4444", // red
    "#06B6D4", // cyan
    "#84CC16", // lime
    "#F97316", // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
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
  try {
    // Find or create category
    let categoryRecord = await db.category.findUnique({
      where: { name: category },
    });

    if (!categoryRecord) {
      categoryRecord = await db.category.create({
        data: {
          name: category,
          color: getRandomColor(),
        },
      });
    }

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

    // Delete existing tags
    await db.accomplishmentTag.deleteMany({
      where: { accomplishmentId: id },
    });

    // Add new tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        let tag = await db.tag.findUnique({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await db.tag.create({
            data: {
              name: tagName,
              color: getRandomColor(),
            },
          });
        }

        await db.accomplishmentTag.create({
          data: {
            accomplishmentId: id,
            tagId: tag.id,
          },
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/calendar");
    revalidatePath("/tags");

    const updatedAccomplishment = await db.accomplishment.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
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
  // Direct database query via Prisma
  return await db.accomplishment.findMany({
    where: { tags: { some: { tag: { name: tag } } } },

    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
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
