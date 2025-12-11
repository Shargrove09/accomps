import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  // Simple API Key authentication
  if (apiKey !== process.env.AGENT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch categories", details: errorMessage },
      { status: 500 }
    );
  }
}
