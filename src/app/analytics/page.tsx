import { Suspense } from "react";
import { getAnalytics } from "@/lib/analytics";
import { analyticsHref, parseAnalyticsSearch, type AnalyticsSearch } from "@/lib/analytics-period";
import { EmptyAnalytics } from "@/components/analytics/empty-analytics";
import { ActivityChartLoader } from "@/components/analytics/activity-chart-loader";
import { KpiRow } from "@/components/analytics/kpi-row";
import { Panel } from "@/components/analytics/panel";
import { PeriodChips } from "@/components/analytics/period-chips";

export const dynamic = "force-dynamic";

const AVG_LABEL = { day: "7-day average", week: "4-week average", month: "3-month average" } as const;

async function Body({ search, now }: { search: AnalyticsSearch; now: Date }) {
  const data = await getAnalytics(search, now);
  const { dataHealth, period, kpis, series } = data;
  if (dataHealth.tier === "empty") return <EmptyAnalytics />;

  const sparse = dataHealth.tier === "sparse";
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
      <KpiRow data={data} showDeltas={!sparse} />
      <Panel title="Activity over time" hint={`${period.label} · per ${period.bucket}`}>
        <ActivityChartLoader
          data={series.map((s) => ({ label: s.label, count: s.count, prev: s.prevCount, avg: s.avg }))}
          avgLabel={AVG_LABEL[period.bucket]}
          summary={summary}
        />
      </Panel>
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
      <PeriodChips search={search} />
      {/* Keyed so a period change shows the skeleton instead of stale panels. */}
      <Suspense key={analyticsHref(search)} fallback={<div className="h-96 animate-pulse rounded-lg bg-east-bay/30" />}>
        <Body search={search} now={now} />
      </Suspense>
    </div>
  );
}
