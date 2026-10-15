"use client";

import dynamic from "next/dynamic";
import type { ActivityPoint } from "@/components/analytics/activity-chart";

const Skeleton = () => <div className="h-72 w-full animate-pulse rounded bg-east-bay/30" />;

// ssr: false: ResponsiveContainer needs a measured width, so server rendering is wasted work.
const ActivityChart = dynamic(() => import("@/components/analytics/activity-chart"), {
  ssr: false,
  loading: Skeleton,
});

export function ActivityChartLoader({ data, avgLabel, summary }: { data: ActivityPoint[]; avgLabel: string; summary: string }) {
  return (
    <div role="img" aria-label={summary} className="h-72 w-full">
      <ActivityChart data={data} avgLabel={avgLabel} />
    </div>
  );
}
