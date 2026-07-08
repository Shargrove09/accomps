import { NextResponse } from "next/server";
import { getAccomplishmentStats } from "@/lib/actions";
import { validateAgentApiKey } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-response";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

/**
 * Resolve a `timeframe` preset into a start date (end is "now"). Mirrors the
 * timeframe vocabulary used by the Python agent's list_accomplishments_by_date.
 * Returns undefined for "all"/unknown so stats cover all time.
 */
function timeframeToStart(timeframe: string | null): Date | undefined {
  if (!timeframe) return undefined;
  const start = new Date();
  switch (timeframe.toLowerCase()) {
    case "today":
      start.setHours(0, 0, 0, 0);
      return start;
    case "week":
      start.setDate(start.getDate() - 7);
      return start;
    case "month":
      start.setMonth(start.getMonth() - 1);
      return start;
    case "year":
      start.setFullYear(start.getFullYear() - 1);
      return start;
    default:
      return undefined;
  }
}

export async function GET(request: Request) {
  const authError = validateAgentApiKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe");
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");

    // Explicit start/end date wins; otherwise fall back to a timeframe preset.
    const startDate = startParam
      ? new Date(startParam)
      : timeframeToStart(timeframe);
    const endDate = endParam ? new Date(endParam) : undefined;

    const stats = await getAccomplishmentStats({ startDate, endDate });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("API Error:", error);
    return jsonError("Failed to compute stats", 500, error);
  }
}
