"use client";

import { useCallback, useMemo, useState } from "react";
import { addMonths, format } from "date-fns";
import { localDayKey } from "@/lib/analytics-period";
import type { AccomplishmentItem } from "@/lib/types";
import { CalendarHeader, type CalendarMode, type LegendCategory } from "./calendar-header";
import { DayRail } from "./day-rail";
import { MonthGrid } from "./month-grid";
import { MonthLog } from "./month-log";
import { keyToLocalDate } from "./day";

export function CalendarView({ entries }: { entries: AccomplishmentItem[] }) {
  const todayKey = localDayKey(new Date());
  const [month, setMonth] = useState(() => keyToLocalDate(todayKey));
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [mode, setMode] = useState<CalendarMode>("grid");
  const [active, setActive] = useState<Set<string>>(new Set());

  // Legend comes from every entry, so it doesn't shift as you page months.
  const categories = useMemo(() => {
    const byId = new Map<string, LegendCategory & { n: number }>();
    for (const e of entries) {
      const c = byId.get(e.category.id) ?? { ...e.category, n: 0 };
      c.n += 1;
      byId.set(e.category.id, c);
    }
    return [...byId.values()].sort((a, b) => b.n - a.n);
  }, [entries]);

  const visible = useMemo(
    () => (active.size ? entries.filter((e) => active.has(e.category.id)) : entries),
    [entries, active],
  );

  const monthKey = format(month, "yyyy-MM");
  const inMonth = useMemo(
    () => visible.filter((e) => localDayKey(e.date).startsWith(monthKey)),
    [visible, monthKey],
  );
  const dayEntries = useMemo(
    () => visible.filter((e) => localDayKey(e.date) === selectedKey),
    [visible, selectedKey],
  );

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const selectDay = useCallback((key: string) => setSelectedKey(key), []);

  return (
    <div>
      <CalendarHeader
        month={month}
        onPrev={() => setMonth((m) => addMonths(m, -1))}
        onNext={() => setMonth((m) => addMonths(m, 1))}
        onToday={() => {
          setMonth(keyToLocalDate(todayKey));
          setSelectedKey(todayKey);
        }}
        mode={mode}
        onMode={setMode}
        categories={categories}
        active={active}
        onToggle={toggle}
      />
      {mode === "grid" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <MonthGrid
            entries={visible}
            month={month}
            onNavigate={setMonth}
            selectedKey={selectedKey}
            onSelectDay={selectDay}
          />
          <DayRail dayKey={selectedKey} entries={dayEntries} />
        </div>
      ) : (
        <div className="max-w-3xl">
          <MonthLog entries={inMonth} month={month} />
        </div>
      )}
    </div>
  );
}
