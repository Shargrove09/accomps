import { NextResponse } from "next/server";
import { addAccomplishment } from "@/lib/actions";
import { db } from "@/lib/db";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  // Simple API Key authentication
  if (apiKey !== process.env.AGENT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, tags } = body;

    if (!title || !category || !Array.isArray(tags)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, category, and tags (as an array)",
        },
        { status: 400 }
      );
    }

    const result = await addAccomplishment({
      title,
      description,
      category,
      tags,
    });

    console.log("--- Accomplishment added ---:", result);

    return NextResponse.json({
      message: "Accomplishment added successfully\n",
      accomplishmentId: result.id,
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to add accomplishment", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.AGENT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get("pageSize") || "5");
    const page = parseInt(searchParams.get("page") || "1");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Build the where clause for date filtering
    const whereClause: { date?: { gte?: Date; lte?: Date } } = {};
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        whereClause.date.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate);
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
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch accomplishments", details: errorMessage },
      { status: 500 }
    );
  }
}
