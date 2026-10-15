"use client";

import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, type DateHeaderProps } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { localDayKey } from "@/lib/analytics-period";
import { safeColor } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { AccomplishmentItem } from "@/lib/types";
import { dateToKey, keyToLocalDate } from "./day";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

type GridEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: true;
  resource: AccomplishmentItem;
};

function EventChip({ event }: { event: GridEvent }) {
  const tags = event.resource.tags.length;
  return (
    <span>
      {event.title}
      {tags > 0 && <span className="text-ink-muted"> · {tags}</span>}
    </span>
  );
}

export function MonthGrid({
  entries,
  month,
  onNavigate,
  selectedKey,
  onSelectDay,
}: {
  entries: AccomplishmentItem[];
  month: Date;
  onNavigate: (d: Date) => void;
  selectedKey: string;
  onSelectDay: (key: string) => void;
}) {
  const { events, counts } = useMemo(() => {
    const counts = new Map<string, number>();
    const events: GridEvent[] = entries.map((e) => {
      const key = localDayKey(e.date);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      const day = keyToLocalDate(key);
      return { title: e.title, start: day, end: day, allDay: true, resource: e };
    });
    return { events, counts };
  }, [entries]);

  const components = useMemo(
    () => ({
      toolbar: () => null,
      event: EventChip,
      month: {
        dateHeader: ({ label, date, isOffRange }: DateHeaderProps) => {
          const key = dateToKey(date);
          const n = counts.get(key) ?? 0;
          const isSelected = key === selectedKey;
          return (
            <button
              type="button"
              aria-pressed={isSelected}
              aria-label={`${format(date, "EEEE, MMMM d")}, ${n} ${n === 1 ? "entry" : "entries"}`}
              onClick={() => onSelectDay(key)}
              className={cn(
                "flex w-full items-center justify-between rounded-sm px-2 py-1 text-sm tabular-nums transition-colors hover:cursor-pointer hover:bg-east-bay/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle",
                n > 0 ? "text-mischka" : "text-ink-muted",
                isOffRange && "opacity-60",
                isSelected && "bg-periwinkle/15 text-mischka ring-1 ring-periwinkle",
              )}
            >
              <span>{label}</span>
              {n > 0 && <span className="text-xs text-ink-muted">{n}</span>}
            </button>
          );
        },
      },
    }),
    [counts, selectedKey, onSelectDay],
  );

  return (
    <div className="h-[46rem] min-w-0">
      <Calendar
        localizer={localizer}
        events={events}
        views={["month"]}
        view="month"
        onView={() => {}}
        date={month}
        onNavigate={onNavigate}
        selectable
        popup={false}
        doShowMoreDrillDown={false}
        onShowMore={(_events, date) => onSelectDay(dateToKey(date))}
        onSelectSlot={({ start }) => onSelectDay(dateToKey(start))}
        onSelectEvent={(e) => onSelectDay(dateToKey(e.start))}
        eventPropGetter={(e) => ({
          style: { borderLeft: `3px solid ${safeColor(e.resource.category.color)}` },
        })}
        components={components}
        messages={{ showMore: (n) => `${n} more` }}
        style={{ height: "100%" }}
      />
    </div>
  );
}
