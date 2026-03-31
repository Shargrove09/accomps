import { NextResponse } from "next/server";

/**
 * Validates the x-api-key header against the AGENT_API_KEY env var.
 *
 * Returns `null` when the key is valid, or a 401 NextResponse when it is not.
 * Usage in a route handler:
 *
 * ```ts
 * const authError = validateAgentApiKey(request);
 * if (authError) return authError;
 * ```
 */
export function validateAgentApiKey(
  request: Request,
): NextResponse | null {
  const expectedKey = process.env.AGENT_API_KEY;
  if (!expectedKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
