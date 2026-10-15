import { btnGhost, fieldInput } from "@/lib/ui";
import type { AnalyticsSearch } from "@/lib/analytics-period";

/** A plain GET form: works without JS and keeps the URL as the only state. */
export function CustomRange({ search, todayKey }: { search: AnalyticsSearch; todayKey: string }) {
  return (
    <form method="get" action="/analytics" className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
      <label htmlFor="range-from" className="sr-only">
        From date
      </label>
      <input id="range-from" name="from" type="date" required max={todayKey} defaultValue={search.from ?? ""} className={`${fieldInput} w-auto`} />
      to
      <label htmlFor="range-to" className="sr-only">
        To date
      </label>
      <input id="range-to" name="to" type="date" required max={todayKey} defaultValue={search.to ?? ""} className={`${fieldInput} w-auto`} />
      <button type="submit" className={btnGhost}>
        Apply
      </button>
    </form>
  );
}
