import Link from "next/link";
import { accomplishmentRangeHref } from "@/lib/accomplishment-query";
import { bucketLabel } from "@/lib/analytics-period";
import { cn } from "@/lib/utils";
import type { AnalyticsSummary } from "@/lib/analytics";

const LEVELS = [0, 0.25, 0.5, 0.75, 1];
const shade = (pct: number) =>
  `color-mix(in oklab, var(--color-periwinkle) ${pct}%, var(--color-steel-gray))`;

export function ConsistencyHeatmap({
  data,
}: {
  data: AnalyticsSummary["heatmap"] & {
    periodStart: string;
    periodEnd: string;
  };
}) {
  const { days, max, periodStart, periodEnd } = data;
  const total = days.reduce((s, d) => s + d.count, 0);
  const active = days.filter((d) => d.count > 0).length;

  return (
    <>
      <div className="scroll-slim fade-x overflow-x-auto py-2">
        <div
          role="group"
          aria-label={`${total} accomplishments across ${active} active days in the last year. Select a day to see its entries.`}
          className="grid w-max grid-flow-col grid-rows-7 gap-1"
        >
          {days.map((d) => {
            const inPeriod = d.date >= periodStart && d.date < periodEnd;
            const cls = cn(
              "h-3 w-3 rounded-sm",
              d.count === 0 && "bg-east-bay/30",
              inPeriod && "ring-1 ring-mischka/40",
            );
            const title = `${bucketLabel(d.date, "day")} ${d.date.slice(0, 4)} · ${d.count} ${d.count === 1 ? "entry" : "entries"}`;
            if (d.count === 0)
              return <span key={d.date} title={title} className={cls} />;
            return (
              <Link
                key={d.date}
                href={accomplishmentRangeHref(d.date, d.date)}
                prefetch={false}
                title={title}
                aria-label={title}
                className={cn(
                  cls,
                  "hover:ring-1 hover:ring-mischka focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                )}
                style={{
                  backgroundColor: shade(25 + 75 * Math.min(1, d.count / max)),
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-3 flex items-center justify-end gap-1.5 text-xs text-ink-muted"
      >
        Less
        {LEVELS.map((l) => (
          <span
            key={l}
            className={cn("h-3 w-3 rounded-sm", l === 0 && "bg-east-bay/30")}
            style={l > 0 ? { backgroundColor: shade(25 + 75 * l) } : undefined}
          />
        ))}
        More
      </div>
    </>
  );
}
