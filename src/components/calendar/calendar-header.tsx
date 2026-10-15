"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { ColorDot } from "@/components/color-dot";
import { chipBase, chipIdle, focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

export type LegendCategory = { id: string; name: string; color: string | null };
export type CalendarMode = "grid" | "log";

const selected = "border-periwinkle bg-periwinkle/15 text-mischka";
const navButton = cn(
  "rounded-md border border-kimberly p-2 text-mischka transition-colors hover:cursor-pointer hover:bg-east-bay",
  focusRing,
);

export function CalendarHeader({
  month,
  onPrev,
  onNext,
  onToday,
  mode,
  onMode,
  categories,
  active,
  onToggle,
}: {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  mode: CalendarMode;
  onMode: (m: CalendarMode) => void;
  categories: LegendCategory[];
  active: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="mr-2 min-w-[9ch] text-3xl font-bold text-mischka">
            {format(month, "MMMM yyyy")}
          </h1>
          <button
            type="button"
            onClick={onPrev}
            className={navButton}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className={navButton}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className={cn(chipBase, chipIdle)}
          >
            Today
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.length > 0 && (
            <button
              type="button"
              aria-expanded={open}
              aria-controls="calendar-filter"
              onClick={() => setOpen((o) => !o)}
              className={cn(
                chipBase,
                chipIdle,
                (open || active.size > 0) && selected,
              )}
            >
              <ListFilter className="h-4 w-4" />
              Filter{active.size > 0 && ` (${active.size})`}
            </button>
          )}
          <div role="group" aria-label="View" className="flex gap-2">
            {(["grid", "log"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => onMode(m)}
                className={cn(chipBase, chipIdle, mode === m && selected)}
              >
                {m === "grid" ? "Grid" : "Log"}
              </button>
            ))}
          </div>
        </div>
      </div>
      {open && categories.length > 0 && (
        <div
          id="calendar-filter"
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap gap-2 rounded-lg border border-kimberly bg-ebony-clay p-4 shadow-sm"
        >
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={active.has(c.id)}
              onClick={() => onToggle(c.id)}
              className={cn(
                chipBase,
                chipIdle,
                "py-0.5",
                active.has(c.id) && selected,
              )}
            >
              <ColorDot color={c.color} />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
