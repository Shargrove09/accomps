import { NextResponse } from "next/server";
import { getAccomplishment, updateAccomplishment } from "@/lib/actions";
import { validateAgentApiKey } from "@/lib/api-auth";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

/** Accept tags as an array or a comma-separated string; blank/absent → undefined (keep existing). */
function normalizeTags(tags: unknown): string[] | undefined {
  if (tags === undefined || tags === null) return undefined;
  const list = Array.isArray(tags) ? tags.map(String) : String(tags).split(",");
  const cleaned = list.map((t) => t.trim()).filter(Boolean);
  return cleaned.length > 0 ? cleaned : undefined;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const existing = await getAccomplishment(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Accomplishment ${id} not found` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, category, tags, date } = body;

    // Partial update: updateAccomplishment does a full replace (and wipes tags if
    // omitted), so overlay only the provided fields onto the existing record.
    const result = await updateAccomplishment({
      id,
      title: title ?? existing.title,
      description: description ?? existing.description ?? undefined,
      category: category ?? existing.category.name,
      tags: normalizeTags(tags) ?? existing.tags.map((t) => t.tag.name),
      ...(date && { date: new Date(date) }),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Accomplishment updated successfully",
      accomplishment: result.data,
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update accomplishment", details: errorMessage },
      { status: 500 }
    );
  }
}
