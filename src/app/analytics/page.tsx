import { Suspense } from "react";
import { getAnalytics } from "@/lib/analytics";
import { analyticsHref, localDayKey, parseAnalyticsSearch, type AnalyticsSearch } from "@/lib/analytics-period";
import { EmptyAnalytics } from "@/components/analytics/empty-analytics";
import { ActivityChartLoader } from "@/components/analytics/activity-chart-loader";
import { ConsistencyHeatmap } from "@/components/analytics/consistency-heatmap";
import { CustomRange } from "@/components/analytics/custom-range";
import { KpiRow } from "@/components/analytics/kpi-row";
import { Panel } from "@/components/analytics/panel";
import { PeriodChips } from "@/components/analytics/period-chips";
import { StackedChartLoader } from "@/components/analytics/stacked-chart-loader";
import { RankedBars } from "@/components/analytics/ranked-bars";
import { WeekRhythm } from "@/components/analytics/week-rhythm";

export const dynamic = "force-dynamic";

const AVG_LABEL = { day: "7-day average", week: "4-week average", month: "3-month average" } as const;

async function Body({ search, now }: { search: AnalyticsSearch; now: Date }) {
  const data = await getAnalytics(search, now);
  const { dataHealth, period, kpis, series } = data;
  if (dataHealth.tier === "empty") return <EmptyAnalytics />;

  const sparse = dataHealth.tier === "sparse";
  const showDeltas = !sparse;
  const summary = `${kpis.total.current} accomplishments over ${period.label.toLowerCase()}, by ${period.bucket}`;

  return (
    <>
      {sparse && (
        <div className="rounded-lg border border-kimberly bg-ebony-clay p-4 text-sm text-ink-muted">
          <p className="tabular-nums">
            {dataHealth.totalAllTime} of 10 entries — trends unlock at 10.
          </p>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-east-bay/50">
            <div
              className="h-full rounded-full bg-periwinkle"
              style={{ width: `${Math.min(100, (dataHealth.totalAllTime / 10) * 100)}%` }}
            />
          </div>
        </div>
      )}
      <KpiRow data={data} showDeltas={showDeltas} />
      <Panel title="Activity over time" hint={`${period.label} · per ${period.bucket} · select a bar to see its entries`}>
        <ActivityChartLoader
          data={series.map((s) => ({ label: s.label, count: s.count, prev: s.prevCount, avg: s.avg, href: s.href }))}
          avgLabel={AVG_LABEL[period.bucket]}
          summary={summary}
        />
      </Panel>
      {!sparse && data.stackCategories.length >= 2 && (
        <Panel title="Category mix over time" hint={`Top categories per ${period.bucket}${data.stackCategories.some((c) => c.id === "other") ? ", the rest grouped as Other" : ""}`}>
          <StackedChartLoader
            categories={data.stackCategories}
            summary={`Accomplishments per ${period.bucket} split by category`}
            data={series.map((s) => ({
              label: s.label,
              href: s.href,
              ...Object.fromEntries(data.stackCategories.map((c) => [`c_${c.id}`, s.cats[c.id] ?? 0])),
            }))}
          />
        </Panel>
      )}
      <Panel title="Consistency" hint="Last 12 months · outlined days fall in the selected period">
        <ConsistencyHeatmap data={{ ...data.heatmap, periodStart: period.startKey, periodEnd: period.endKey }} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Categories"
          hint={showDeltas ? "Share of entries, change vs. previous period" : "Share of entries"}
          className={sparse ? "lg:col-span-3" : "lg:col-span-2"}
        >
          <RankedBars items={data.byCategory} total={kpis.total.current} showDeltas={!sparse} comparable={dataHealth.comparable} />
        </Panel>
        {!sparse && (
          <Panel title="Weekly rhythm" hint="When you log entries" className="lg:col-span-1">
            <WeekRhythm days={data.dayOfWeek} />
          </Panel>
        )}
      </div>
      {!sparse && (
        <Panel title="Top tags" hint="Change vs. previous period">
          <RankedBars items={data.byTag} total={kpis.total.current} showDeltas comparable={dataHealth.comparable} />
        </Panel>
      )}
    </>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const search = parseAnalyticsSearch(await searchParams);
  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-mischka">Analytics</h1>
        <p className="text-kimberly">Trends and patterns across your accomplishments.</p>
      </div>
      <div className="space-y-3">
        <PeriodChips search={search} />
        <CustomRange search={search} todayKey={localDayKey(now)} />
      </div>
      {/* Keyed so a period change shows the skeleton instead of stale panels. */}
      <Suspense key={analyticsHref(search)} fallback={<div className="h-96 animate-pulse rounded-lg bg-east-bay/30" />}>
        <Body search={search} now={now} />
      </Suspense>
    </div>
  );
}
