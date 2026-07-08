import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { validateAgentApiKey } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-response";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

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
    return jsonError("Failed to fetch categories", 500, error);
  }
}
