import type { AnalyticsSummary } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FULL = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

export function WeekRhythm({ days }: { days: AnalyticsSummary["dayOfWeek"] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a));
  const quietest = days.reduce((a, b) => (b.count < a.count ? b : a));
  const callout =
    busiest.count === 0
      ? null
      : quietest.count > 0 && busiest.dow !== quietest.dow
        ? `You log ${(busiest.count / quietest.count).toFixed(1)}× more on ${FULL[busiest.dow]} than ${FULL[quietest.dow]}.`
        : `Most entries land on ${FULL[busiest.dow]}.`;

  return (
    <div>
      <div
        role="img"
        aria-label={days.map((d) => `${d.label} ${d.count}`).join(", ")}
        className="flex h-32 items-end gap-2"
      >
        {days.map((d) => (
          <div key={d.dow} className="flex h-full flex-1 flex-col justify-end" title={`${d.label} · ${d.count}`}>
            <span
              className={cn("w-full rounded-sm", d.count > 0 ? "bg-periwinkle" : "bg-kimberly/30")}
              style={{ height: d.count > 0 ? `${Math.max(8, (d.count / max) * 100)}%` : "2px" }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-2 text-xs text-ink-muted">
        {days.map((d) => (
          <span key={d.dow} className="flex-1 text-center">
            {d.label[0]}
          </span>
        ))}
      </div>
      {callout && <p className="mt-3 text-sm text-mischka">{callout}</p>}
    </div>
  );
}
