import { NextResponse } from "next/server";
import { getAccomplishment, updateAccomplishment } from "@/lib/actions";
import { validateAgentApiKey } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-response";

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
      return jsonError(`Accomplishment ${id} not found`, 404);
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
      return jsonError(result.error ?? "Failed to update accomplishment", 400);
    }

    return NextResponse.json({
      message: "Accomplishment updated successfully",
      accomplishment: result.data,
    });
  } catch (error) {
    console.error("API Error:", error);
    return jsonError("Failed to update accomplishment", 500, error);
  }
}
