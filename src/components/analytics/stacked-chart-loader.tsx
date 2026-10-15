"use client";

import dynamic from "next/dynamic";
import type { StackCategory, StackPoint } from "@/components/analytics/stacked-chart";

const Skeleton = () => <div className="h-72 w-full animate-pulse rounded bg-east-bay/30" />;

const StackedChart = dynamic(() => import("@/components/analytics/stacked-chart"), { ssr: false, loading: Skeleton });

export function StackedChartLoader({
  data,
  categories,
  summary,
}: {
  data: StackPoint[];
  categories: StackCategory[];
  summary: string;
}) {
  return (
    <div role="img" aria-label={summary} className="h-72 w-full">
      <StackedChart data={data} categories={categories} />
    </div>
  );
}
