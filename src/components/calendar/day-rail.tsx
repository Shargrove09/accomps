import { format } from "date-fns";
import type { AccomplishmentItem } from "@/lib/types";
import { EntryCard } from "./entry-card";
import { entryCount, keyToLocalDate } from "./day";

export function DayRail({
  dayKey,
  entries,
}: {
  dayKey: string;
  entries: AccomplishmentItem[];
}) {
  const label = format(keyToLocalDate(dayKey), "EEE, MMM d");
  return (
    <section
      aria-label={`Entries for ${label}`}
      className="rounded-lg border border-kimberly bg-ebony-clay p-6 shadow-sm lg:sticky lg:top-8"
    >
      <h2 className="text-xl font-semibold text-mischka">{label}</h2>
      {entries.length > 0 && (
        <p className="mt-1 text-sm text-ink-muted">{entryCount(entries.length)}</p>
      )}
      {/* Keyed so the fade replays whenever the selected day changes. */}
      <div
        key={dayKey}
        className="mt-4 space-y-3 animate-in fade-in animation-duration-150"
      >
        {entries.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing logged on {label}.</p>
        ) : (
          entries.map((e) => <EntryCard key={e.id} entry={e} clamp />)
        )}
      </div>
    </section>
  );
}
