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
