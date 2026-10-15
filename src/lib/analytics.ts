import { cache } from "react";
import { db } from "@/lib/db";
import { accomplishmentRangeHref } from "@/lib/accomplishment-query";
import {
  DOW_LABELS,
  addDaysKey,
  bucketKey,
  bucketLabel,
  buildPeriod,
  diffDaysKey,
  dowOfKey,
  keyToInstant,
  localDayKey,
  resolvePeriod,
  type AnalyticsSearch,
  type Bucket,
  type Period,
} from "@/lib/analytics-period";

const HEATMAP_WEEKS = 53;
const SPARSE_ENTRIES = 10;
const SPARSE_DAYS = 14;
const STACK_TOP = 5;
const AVG_WINDOW: Record<Bucket, number> = { day: 7, week: 4, month: 3 };

/** pct is null when previous is 0, so the UI renders "New" rather than Infinity%. */
export type Delta = { current: number; previous: number; diff: number; pct: number | null };

export type AnalyticsSummary = {
  period: Period;
  kpis: {
    total: Delta;
    activeDays: Delta;
    perActiveDay: Delta;
    currentStreak: number;
    longestStreak: { length: number; endDate: string | null };
  };
  /** Zero-filled and dense: one entry per bucket, never gaps. */
  series: {
    key: string;
    label: string;
    count: number;
    prevCount: number;
    avg: number | null;
    /** Entries per stack category id in this bucket. */
    cats: Record<string, number>;
    /** The accomplishments list filtered to this bucket. */
    href: string;
  }[];
  /** Top categories plus an "other" remainder, for the stacked chart. */
  stackCategories: { id: string; name: string; color: string | null }[];
  heatmap: { days: { date: string; count: number }[]; max: number; startDate: string };
  byCategory: { id: string; name: string; color: string | null; count: number; prevCount: number; share: number }[];
  byTag: { id: string; name: string; color: string | null; count: number; prevCount: number }[];
  dayOfWeek: { dow: number; label: string; count: number; share: number }[];
  dataHealth: {
    totalAllTime: number;
    firstEntry: string | null;
    daysOfHistory: number;
    tier: "empty" | "sparse" | "healthy";
    /** True when the previous period lies entirely at/after the first entry. */
    comparable: boolean;
  };
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function delta(current: number, previous: number): Delta {
  const diff = round1(current - previous);
  return { current, previous, diff, pct: previous === 0 ? null : (current - previous) / previous };
}

function countBy<T>(items: T[], key: (t: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) m.set(key(it), (m.get(key(it)) ?? 0) + 1);
  return m;
}

function daysBetween(startKey: string, endKey: string): string[] {
  const n = diffDaysKey(endKey, startKey);
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDaysKey(startKey, i));
}

/** Longest run of consecutive days in a sorted set of day keys. */
function longestRun(sortedKeys: string[]): { length: number; endDate: string | null } {
  let best = { length: 0, endDate: null as string | null };
  let run = 0;
  sortedKeys.forEach((k, i) => {
    run = i > 0 && diffDaysKey(k, sortedKeys[i - 1]) === 1 ? run + 1 : 1;
    if (run >= best.length) best = { length: run, endDate: k };
  });
  return best;
}

/** Inclusive local-day span a bucket covers. */
function bucketSpan(key: string, bucket: Bucket): [string, string] {
  if (bucket === "day") return [key, key];
  if (bucket === "week") return [key, addDaysKey(key, 6)];
  const [y, m] = key.split("-").map(Number);
  return [`${key}-01`, new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10)];
}

function currentRun(daySet: Set<string>, todayKey: string): number {
  let cursor = daySet.has(todayKey) ? todayKey : addDaysKey(todayKey, -1); // a streak may end yesterday
  let n = 0;
  while (daySet.has(cursor)) {
    n++;
    cursor = addDaysKey(cursor, -1);
  }
  return n;
}

export const EMPTY_ANALYTICS = (search: AnalyticsSearch, now: Date): AnalyticsSummary => {
  const period = resolvePeriod(search, now);
  const zero = delta(0, 0);
  return {
    period,
    kpis: { total: zero, activeDays: zero, perActiveDay: zero, currentStreak: 0, longestStreak: { length: 0, endDate: null } },
    series: [],
    stackCategories: [],
    heatmap: { days: [], max: 4, startDate: period.startKey },
    byCategory: [],
    byTag: [],
    dayOfWeek: [],
    dataHealth: { totalAllTime: 0, firstEntry: null, daysOfHistory: 0, tier: "empty", comparable: false },
  };
};

export const getAnalytics = cache(
  async (search: AnalyticsSearch, now: Date): Promise<AnalyticsSummary> => {
    try {
      const todayKey = localDayKey(now);
      const [totalAllTime, firstRow] = await Promise.all([
        db.accomplishment.count(),
        db.accomplishment.findFirst({ orderBy: { date: "asc" }, select: { date: true } }),
      ]);
      const firstEntry = firstRow ? localDayKey(firstRow.date) : null;
      const daysOfHistory = firstEntry ? diffDaysKey(todayKey, firstEntry) + 1 : 0;
      const tier: AnalyticsSummary["dataHealth"]["tier"] =
        totalAllTime === 0 ? "empty" : totalAllTime < SPARSE_ENTRIES || daysOfHistory < SPARSE_DAYS ? "sparse" : "healthy";

      let period = resolvePeriod(search, now, firstEntry);
      if (tier === "sparse" && firstEntry) {
        // Few entries: daily buckets over at least two weeks, not a smear across months.
        const floor = addDaysKey(todayKey, -(SPARSE_DAYS - 1));
        const startKey = firstEntry < floor ? firstEntry : floor;
        period = buildPeriod(period.preset, period.label, startKey, period.endKey, "day");
      }

      const heatStartKey = (() => {
        const sunday = addDaysKey(todayKey, -dowOfKey(todayKey));
        return addDaysKey(sunday, -(HEATMAP_WEEKS - 1) * 7);
      })();
      const windowStartKey = [period.prevStartKey, heatStartKey].sort()[0];
      const windowStart = keyToInstant(windowStartKey);
      const windowFilter = { date: { gte: windowStart, lt: period.end } };

      const [rows, links, cats, tags] = await Promise.all([
        db.accomplishment.findMany({
          where: windowFilter,
          select: { id: true, date: true, categoryId: true },
          orderBy: { date: "asc" },
        }),
        db.accomplishmentTag.findMany({
          where: { accomplishment: windowFilter },
          select: { accomplishmentId: true, tagId: true },
        }),
        db.category.findMany({ select: { id: true, name: true, color: true } }),
        db.tag.findMany({ select: { id: true, name: true, color: true } }),
      ]);

      const entries = rows.map((r) => ({ id: r.id, key: localDayKey(r.date), categoryId: r.categoryId }));
      const inCurrent = (k: string) => k >= period.startKey && k < period.endKey;
      const inPrev = (k: string) => k >= period.prevStartKey && k < period.startKey;
      const cur = entries.filter((e) => inCurrent(e.key));
      const prev = entries.filter((e) => inPrev(e.key));

      const curDayCounts = countBy(cur, (e) => e.key);
      const prevDayCounts = countBy(prev, (e) => e.key);
      const activeCur = curDayCounts.size;
      const activePrev = prevDayCounts.size;

      // Series: dense buckets for the period, previous period aligned by bucket index.
      const bucketsOf = (startKey: string, endKey: string, counts: Map<string, number>) => {
        const m = new Map<string, number>();
        for (const d of daysBetween(startKey, endKey)) {
          const b = bucketKey(d, period.bucket);
          m.set(b, (m.get(b) ?? 0) + (counts.get(d) ?? 0));
        }
        return [...m.entries()];
      };
      const curBuckets = bucketsOf(period.startKey, period.endKey, curDayCounts);
      const prevBuckets = bucketsOf(period.prevStartKey, period.startKey, prevDayCounts);
      const win = AVG_WINDOW[period.bucket];

      const catTotals = countBy(cur, (e) => e.categoryId);
      const ranked = cats
        .map((c) => ({ ...c, n: catTotals.get(c.id) ?? 0 }))
        .filter((c) => c.n > 0)
        .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
      const topIds = new Set(ranked.slice(0, STACK_TOP).map((c) => c.id));
      const stackCategories = [
        ...ranked.slice(0, STACK_TOP).map(({ id, name, color }) => ({ id, name, color })),
        ...(ranked.length > STACK_TOP ? [{ id: "other", name: "Other", color: null }] : []),
      ];
      const catsByBucket = new Map<string, Record<string, number>>();
      for (const e of cur) {
        const b = bucketKey(e.key, period.bucket);
        const id = topIds.has(e.categoryId) ? e.categoryId : "other";
        const row = catsByBucket.get(b) ?? {};
        row[id] = (row[id] ?? 0) + 1;
        catsByBucket.set(b, row);
      }

      const lastKey = addDaysKey(period.endKey, -1);
      const series = curBuckets.map(([key, count], i) => {
        const slice = curBuckets.slice(Math.max(0, i - win + 1), i + 1);
        const [spanFrom, spanTo] = bucketSpan(key, period.bucket);
        return {
          key,
          label: bucketLabel(key, period.bucket),
          count,
          prevCount: prevBuckets[i]?.[1] ?? 0,
          avg: round1(slice.reduce((s, [, c]) => s + c, 0) / slice.length),
          cats: catsByBucket.get(key) ?? {},
          href: accomplishmentRangeHref(
            spanFrom < period.startKey ? period.startKey : spanFrom,
            spanTo > lastKey ? lastKey : spanTo,
          ),
        };
      });

      // Streaks and heatmap come from the full window, independent of the period.
      const allDayCounts = countBy(entries, (e) => e.key);
      const sortedDays = [...allDayCounts.keys()].sort();
      const heatDays = daysBetween(heatStartKey, addDaysKey(todayKey, 1)).map((date) => ({
        date,
        count: allDayCounts.get(date) ?? 0,
      }));
      const nonZero = heatDays.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
      const p90 = nonZero.length ? nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * 0.9))] : 0;

      const rank = <K extends { id: string; name: string; color: string | null }>(
        meta: K[],
        curCounts: Map<string, number>,
        prevCounts: Map<string, number>,
      ) =>
        meta
          .map((m) => ({ id: m.id, name: m.name, color: m.color, count: curCounts.get(m.id) ?? 0, prevCount: prevCounts.get(m.id) ?? 0 }))
          .filter((m) => m.count > 0)
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

      const byCategory = rank(cats, countBy(cur, (e) => e.categoryId), countBy(prev, (e) => e.categoryId)).map((c) => ({
        ...c,
        share: cur.length ? c.count / cur.length : 0,
      }));

      const keyById = new Map(entries.map((e) => [e.id, e.key]));
      const tagCur = new Map<string, number>();
      const tagPrev = new Map<string, number>();
      for (const l of links) {
        const k = keyById.get(l.accomplishmentId);
        if (!k) continue;
        const target = inCurrent(k) ? tagCur : inPrev(k) ? tagPrev : null;
        target?.set(l.tagId, (target.get(l.tagId) ?? 0) + 1);
      }
      const byTag = rank(tags, tagCur, tagPrev);

      const dowCounts = countBy(cur, (e) => String(dowOfKey(e.key)));
      const dayOfWeek = DOW_LABELS.map((label, dow) => ({
        dow,
        label,
        count: dowCounts.get(String(dow)) ?? 0,
        share: cur.length ? (dowCounts.get(String(dow)) ?? 0) / cur.length : 0,
      }));

      const perActiveCur = activeCur ? cur.length / activeCur : 0;
      const perActivePrev = activePrev ? prev.length / activePrev : 0;

      return {
        period,
        kpis: {
          total: delta(cur.length, prev.length),
          activeDays: delta(activeCur, activePrev),
          perActiveDay: delta(round1(perActiveCur), round1(perActivePrev)),
          currentStreak: currentRun(new Set(sortedDays), todayKey),
          longestStreak: longestRun(sortedDays),
        },
        series,
        stackCategories,
        heatmap: { days: heatDays, max: Math.max(4, p90), startDate: heatStartKey },
        byCategory,
        byTag,
        dayOfWeek,
        dataHealth: {
          totalAllTime,
          firstEntry,
          daysOfHistory,
          tier,
          comparable: tier !== "sparse" && firstEntry !== null && firstEntry <= period.prevStartKey,
        },
      };
    } catch (error) {
      console.error("Error computing analytics:", error);
      return EMPTY_ANALYTICS(search, now);
    }
  },
);
