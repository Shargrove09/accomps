import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAgentApiKey } from "@/lib/api-auth";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const tags = await db.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("API Error fetching tags:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch tags", details: errorMessage },
      { status: 500 }
    );
  }
}
