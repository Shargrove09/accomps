import { NextResponse } from "next/server";

/**
 * Standard JSON error response for the /api/agent/* routes.
 *
 * Keeps the `{ error, details? }` shape consistent across handlers instead of
 * copy-pasting the same NextResponse.json(...) block into every catch clause.
 *
 * ```ts
 * } catch (error) {
 *   return jsonError("Failed to fetch accomplishments", 500, error);
 * }
 * ```
 */
export function jsonError(
  message: string,
  status: number,
  details?: unknown,
): NextResponse {
  const body: { error: string; details?: string } = { error: message };
  if (details !== undefined) {
    body.details =
      details instanceof Error ? details.message : String(details);
  }
  return NextResponse.json(body, { status });
}

/**
 * Machine-readable code returned when a write names a category that doesn't
 * exist and the caller isn't allowed to create one. Callers (the Python agent)
 * branch on this to prompt the user rather than retrying blindly.
 */
export const UNKNOWN_CATEGORY = "UNKNOWN_CATEGORY";

/**
 * 409 for a write that named a category outside the existing set. Carries the
 * full category list — it's small, and it saves the agent a second round trip
 * to `list_categories` before it can suggest alternatives.
 */
export function jsonUnknownCategory(
  message: string,
  availableCategories: string[],
): NextResponse {
  return NextResponse.json(
    { error: message, code: UNKNOWN_CATEGORY, availableCategories },
    { status: 409 },
  );
}
