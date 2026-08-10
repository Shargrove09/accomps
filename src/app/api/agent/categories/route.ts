import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCategory } from "@/lib/actions";
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

/**
 * Deliberately add a category to the taxonomy.
 *
 * Deliberately separate from POST /api/agent/accomplishments: recording an
 * accomplishment never creates a category, so growing the closed set is always
 * its own named call that the user can see and approve on its own terms.
 */
export async function POST(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return jsonError("Missing required field: name", 400);
    }

    const result = await createCategory({ name, description });

    if (!result.success) {
      // Already present (case-insensitively) — tell the caller the canonical
      // spelling so it can reuse that instead of retrying with a variant.
      if (result.alreadyExists) {
        return NextResponse.json(
          {
            error: result.error,
            existingCategory: result.data?.name,
          },
          { status: 409 }
        );
      }
      return jsonError(result.error ?? "Failed to create category", 400);
    }

    return NextResponse.json(
      {
        message: "Category created successfully",
        category: result.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return jsonError("Failed to create category", 500, error);
  }
}
