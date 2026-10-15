import Link from "next/link";
import { PERIOD_PRESETS, analyticsHref, type AnalyticsSearch } from "@/lib/analytics-period";
import { chipBase, chipIdle } from "@/lib/ui";
import { cn } from "@/lib/utils";

const LABELS: Record<(typeof PERIOD_PRESETS)[number], string> = {
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
  ytd: "Year to date",
  all: "All time",
};

export function PeriodChips({ search }: { search: AnalyticsSearch }) {
  const custom = Boolean(search.from && search.to);
  return (
    <nav aria-label="Time period" className="flex flex-wrap gap-2">
      {PERIOD_PRESETS.map((p) => {
        const active = !custom && search.range === p;
        return (
          <Link
            key={p}
            href={analyticsHref({ range: p })}
            aria-current={active ? "page" : undefined}
            className={cn(chipBase, chipIdle, active && "border-periwinkle bg-periwinkle/15 text-mischka")}
          >
            {LABELS[p]}
          </Link>
        );
      })}
    </nav>
  );
}
