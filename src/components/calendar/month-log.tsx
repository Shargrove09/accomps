import { format } from "date-fns";
import { localDayKey } from "@/lib/analytics-period";
import type { AccomplishmentItem } from "@/lib/types";
import { EntryCard } from "./entry-card";
import { entryCount, keyToLocalDate } from "./day";

/** Every entry in the month, grouped by day, newest first; the keyboard-friendly twin of the grid. */
export function MonthLog({
  entries,
  month,
}: {
  entries: AccomplishmentItem[];
  month: Date;
}) {
  const groups = new Map<string, AccomplishmentItem[]>();
  for (const e of entries) {
    const key = localDayKey(e.date);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }

  if (groups.size === 0) {
    return (
      <p className="rounded-lg border border-kimberly bg-ebony-clay p-6 text-ink-muted">
        No entries in {format(month, "MMMM")}.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {[...groups].map(([key, items]) => (
        <section key={key} aria-labelledby={`log-${key}`}>
          <div className="flex items-baseline justify-between border-b border-kimberly/25 pb-2">
            <h2 id={`log-${key}`} className="text-lg font-semibold text-mischka">
              {format(keyToLocalDate(key), "EEEE, MMM d")}
            </h2>
            <span className="text-sm tabular-nums text-ink-muted">
              {entryCount(items.length)}
            </span>
          </div>
          <div className="mt-3 space-y-3">
            {items.map((e) => (
              <EntryCard key={e.id} entry={e} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
