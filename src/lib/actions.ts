"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    return { success: true };
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
