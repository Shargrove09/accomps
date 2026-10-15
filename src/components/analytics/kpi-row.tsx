import { Flame } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { DeltaPill } from "@/components/analytics/delta-pill";
import type { AnalyticsSummary } from "@/lib/analytics";

const tile = "rounded-lg border border-kimberly bg-ebony-clay p-5 text-center shadow-sm";

export function KpiRow({ data, showDeltas }: { data: AnalyticsSummary; showDeltas: boolean }) {
  const { kpis, dataHealth, period } = data;
  const comparable = showDeltas && dataHealth.comparable;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className={tile}>
        <div className="text-2xl font-bold tabular-nums text-mischka">
          <CountUp value={kpis.total.current} />
        </div>
        <div className="text-sm text-ink-muted">Accomplishments</div>
        {showDeltas && <DeltaPill delta={kpis.total} comparable={comparable} />}
      </div>
      <div className={tile}>
        <div className="text-2xl font-bold tabular-nums text-mischka">
          <CountUp value={kpis.activeDays.current} />
          <span className="text-base font-normal text-ink-muted"> / {period.days}</span>
        </div>
        <div className="text-sm text-ink-muted">Active days</div>
        {showDeltas && <DeltaPill delta={kpis.activeDays} comparable={comparable} />}
      </div>
      <div className={tile}>
        <div className="flex items-center justify-center gap-1.5 text-2xl font-bold tabular-nums text-mischka">
          <Flame aria-hidden="true" className="h-5 w-5 text-ink-muted" />
          <CountUp value={kpis.currentStreak} />
        </div>
        <div className="text-sm text-ink-muted">Day streak</div>
        <span className="text-xs tabular-nums text-ink-muted">Longest {kpis.longestStreak.length}</span>
      </div>
      <div className={tile}>
        <div className="text-2xl font-bold tabular-nums text-mischka">{kpis.perActiveDay.current}</div>
        <div className="text-sm text-ink-muted">Per active day</div>
        {showDeltas && <DeltaPill delta={kpis.perActiveDay} comparable={comparable} />}
      </div>
    </div>
  );
}
