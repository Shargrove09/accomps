import { NextResponse } from "next/server";
import { addAccomplishment } from "@/lib/actions";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { validateAgentApiKey } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-response";
import { parsePagination } from "@/lib/pagination";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { title, description, category, tags } = body;

    if (!title || !category || !Array.isArray(tags)) {
      return jsonError(
        "Missing required fields: title, category, and tags (as an array)",
        400
      );
    }

    const result = await addAccomplishment({
      title,
      description,
      category,
      tags,
    });

    // addAccomplishment returns { success: false, error } on validation/DB
    // failure — surface that as a 400 instead of a misleading 200.
    if (!result.success) {
      return jsonError(result.error ?? "Failed to add accomplishment", 400);
    }

    return NextResponse.json({
      message: "Accomplishment added successfully",
      accomplishmentId: result.id,
    });
  } catch (error) {
    console.error("API Error:", error);
    return jsonError("Failed to add accomplishment", 500, error);
  }
}

export async function GET(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip } = parsePagination(searchParams);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    // Accept either `search` or `q` for a case-insensitive title match.
    const search = searchParams.get("search") || searchParams.get("q");
    const category = searchParams.get("category");
    // `tag` may be a single name or a comma-separated list (matches ANY of them).
    const tag = searchParams.get("tag");

    // Build the where clause for date + title + tag/category filtering.
    const whereClause: Prisma.AccomplishmentWhereInput = {};
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
      }
    }
    if (search && search.trim()) {
      whereClause.title = { contains: search.trim(), mode: "insensitive" };
    }
    if (category && category.trim()) {
      whereClause.category = {
        name: { equals: category.trim(), mode: "insensitive" },
      };
    }
    if (tag && tag.trim()) {
      const tagNames = tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (tagNames.length > 0) {
        whereClause.tags = {
          some: { tag: { name: { in: tagNames, mode: "insensitive" } } },
        };
      }
    }

    const accomplishments = await db.accomplishment.findMany({
      where: whereClause,
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
      skip: skip,
      take: pageSize,
    });

    // Get total count for better pagination info
    const totalCount = await db.accomplishment.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasMore = page < totalPages;

    return NextResponse.json({
      accomplishments,
      page,
      pageSize,
      totalCount,
      totalPages,
      hasMore,
    });
  } catch (error) {
    console.error("API Error:", error);
    return jsonError("Failed to fetch accomplishments", 500, error);
  }
}
