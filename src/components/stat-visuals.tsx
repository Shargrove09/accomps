import { localDayKey, startOfWeekLocal } from "@/lib/analytics-period";
import { ColorDot } from "@/components/color-dot";
import { cn } from "@/lib/utils";

type Counted = { color: string | null; count: number };

/** One slice per item, widths proportional to count; shows how your work splits. */
export function SegmentedBar({ items }: { items: Counted[] }) {
  const top = items.slice(0, 5);
  if (top.length === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="mx-auto mt-3 flex h-1.5 w-full max-w-28 gap-px overflow-hidden rounded-full"
    >
      {top.map((it, i) => (
        <span
          key={i}
          className="h-full"
          style={{
            flexGrow: it.count,
            backgroundColor: /^#[0-9a-f]{6}$/i.test(it.color ?? "") ? it.color! : "#6B7280",
          }}
        />
      ))}
    </div>
  );
}

/** The five most used, in their own colors, then how many more exist. */
export function DotRow({ items, total }: { items: Counted[]; total: number }) {
  const top = items.slice(0, 5);
  if (top.length === 0) return null;
  const more = total - top.length;
  return (
    <div aria-hidden="true" className="mt-3 flex items-center justify-center gap-1.5">
      {top.map((it, i) => (
        <ColorDot key={i} color={it.color} className="h-2.5 w-2.5" />
      ))}
      {more > 0 && (
        <span className="ml-0.5 text-xs tabular-nums text-ink-muted">+{more}</span>
      )}
    </div>
  );
}

/** Sunday-to-Saturday of the current week, so the bars sum to the "This week" count. */
export function currentWeek(perDay: { date: string; count: number }[]) {
  const counts = new Map(perDay.map((d) => [d.date, d.count]));
  const start = startOfWeekLocal(); // +12h keeps the key on the right day across DST
  const today = localDayKey(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const key = localDayKey(new Date(start.getTime() + (i * 24 + 12) * 3600_000));
    return { key, count: counts.get(key) ?? 0, isToday: key === today };
  });
}

export function WeekStrip({ days }: { days: ReturnType<typeof currentWeek> }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div aria-hidden="true" className="mx-auto mt-3 flex h-5 w-full max-w-28 items-end gap-1">
      {days.map((d) => (
        <span
          key={d.key}
          className={cn(
            "flex-1 rounded-sm",
            d.count > 0 ? "bg-periwinkle" : "bg-kimberly/30",
            d.isToday && d.count === 0 && "bg-mischka/50",
          )}
          style={{ height: d.count > 0 ? `${Math.max(30, (d.count / max) * 100)}%` : "2px" }}
        />
      ))}
    </div>
  );
}
