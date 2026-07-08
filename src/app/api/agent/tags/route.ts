import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAgentApiKey } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-response";

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
    return jsonError("Failed to fetch tags", 500, error);
  }
}
