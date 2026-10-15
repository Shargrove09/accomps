import { TZDate } from "@date-fns/tz";
import { format, startOfDay, startOfWeek } from "date-fns";

export const APP_TZ = process.env.NEXT_PUBLIC_APP_TZ ?? "America/New_York";

/** Local-calendar day (YYYY-MM-DD) of an instant in APP_TZ. */
export const localDayKey = (d: Date): string => format(new TZDate(d, APP_TZ), "yyyy-MM-dd");

/** Local midnight today in APP_TZ. */
export const todayLocal = (): TZDate => startOfDay(TZDate.tz(APP_TZ));

/** Local Sunday midnight of the current week, as a plain Date. */
export const startOfWeekLocal = (): Date =>
  new Date(startOfWeek(TZDate.tz(APP_TZ), { weekStartsOn: 0 }).getTime());

/** Resolve an optional YYYY-MM-DD to an instant: undefined/today → now, past → local noon, bad/future → null. */
export function resolveEntryDate(input?: string, now: Date = new Date()): Date | null {
  if (!input) return now;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const noon = new TZDate(y, mo - 1, d, 12, APP_TZ);
  if (noon.getMonth() !== mo - 1 || noon.getDate() !== d) return null;
  const key = localDayKey(now);
  if (input === key) return now;
  return input > key ? null : new Date(noon.getTime());
}

// ── Periods ──────────────────────────────────────────────────────────────────

export const PERIOD_PRESETS = ["30d", "90d", "12m", "ytd", "all"] as const;
export type PeriodPreset = (typeof PERIOD_PRESETS)[number] | "custom";
export const DEFAULT_PRESET = "90d" as const;

export type Bucket = "day" | "week" | "month";
const BUCKETS: Bucket[] = ["day", "week", "month"];

export type AnalyticsSearch = {
  range: (typeof PERIOD_PRESETS)[number];
  from: string | null;
  to: string | null;
  bucket: Bucket | null;
};

/** Half-open [start, end) in local days; prev* is the equal-length span just before. */
export type Period = {
  preset: PeriodPreset;
  label: string;
  bucket: Bucket;
  days: number;
  startKey: string;
  endKey: string;
  prevStartKey: string;
  start: Date;
  end: Date;
  prevStart: Date;
};

const KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Day keys are calendar dates, so arithmetic on them is done in UTC to dodge DST.
const keyToUtc = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const addDaysKey = (key: string, n: number): string =>
  new Date(keyToUtc(key) + n * 86_400_000).toISOString().slice(0, 10);
export const diffDaysKey = (a: string, b: string): number =>
  Math.round((keyToUtc(a) - keyToUtc(b)) / 86_400_000);
export const dowOfKey = (key: string): number => new Date(keyToUtc(key)).getUTCDay();

/** Local midnight of a day key, as an instant. */
export const keyToInstant = (key: string): Date => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(new TZDate(y, m - 1, d, 0, APP_TZ).getTime());
};

export function bucketKey(dayKey: string, bucket: Bucket): string {
  if (bucket === "day") return dayKey;
  if (bucket === "week") return addDaysKey(dayKey, -dowOfKey(dayKey));
  return dayKey.slice(0, 7);
}

export function bucketLabel(key: string, bucket: Bucket): string {
  const [y, m, d] = key.split("-");
  const mon = MONTHS[Number(m) - 1];
  return bucket === "month" ? `${mon} ’${y.slice(2)}` : `${mon} ${Number(d)}`;
}

export const bucketFor = (days: number): Bucket => (days <= 45 ? "day" : days <= 182 ? "week" : "month");

export function parseAnalyticsSearch(
  sp: Record<string, string | string[] | undefined>,
): AnalyticsSearch {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const range = one(sp.range);
  const bucket = one(sp.bucket);
  const from = one(sp.from);
  const to = one(sp.to);
  return {
    range: (PERIOD_PRESETS as readonly string[]).includes(range ?? "")
      ? (range as AnalyticsSearch["range"])
      : DEFAULT_PRESET,
    from: from && KEY_RE.test(from) ? from : null,
    to: to && KEY_RE.test(to) ? to : null,
    bucket: BUCKETS.includes(bucket as Bucket) ? (bucket as Bucket) : null,
  };
}

export function analyticsHref(search: Partial<AnalyticsSearch>): string {
  const p = new URLSearchParams();
  if (search.from && search.to) {
    p.set("from", search.from);
    p.set("to", search.to);
  } else if (search.range && search.range !== DEFAULT_PRESET) {
    p.set("range", search.range);
  }
  if (search.bucket) p.set("bucket", search.bucket);
  const qs = p.toString();
  return qs ? `/analytics?${qs}` : "/analytics";
}

export function buildPeriod(
  preset: PeriodPreset,
  label: string,
  startKey: string,
  endKey: string,
  bucket?: Bucket | null,
): Period {
  const days = Math.max(1, diffDaysKey(endKey, startKey));
  const prevStartKey = addDaysKey(startKey, -days);
  return {
    preset,
    label,
    bucket: bucket ?? bucketFor(days),
    days,
    startKey,
    endKey,
    prevStartKey,
    start: keyToInstant(startKey),
    end: keyToInstant(endKey),
    prevStart: keyToInstant(prevStartKey),
  };
}

/** Pure and `now`-injected; `firstEntryKey` anchors the "all" preset. */
export function resolvePeriod(
  search: AnalyticsSearch,
  now: Date,
  firstEntryKey: string | null = null,
): Period {
  const todayKey = localDayKey(now);
  const tomorrowKey = addDaysKey(todayKey, 1);

  if (search.from && search.to && search.from <= search.to) {
    const endKey = search.to >= todayKey ? tomorrowKey : addDaysKey(search.to, 1);
    return buildPeriod("custom", `${search.from} – ${search.to}`, search.from, endKey, search.bucket);
  }

  switch (search.range) {
    case "30d":
      return buildPeriod("30d", "Last 30 days", addDaysKey(tomorrowKey, -30), tomorrowKey, search.bucket);
    case "12m":
      return buildPeriod("12m", "Last 12 months", addDaysKey(tomorrowKey, -365), tomorrowKey, search.bucket);
    case "ytd":
      return buildPeriod("ytd", "Year to date", `${todayKey.slice(0, 4)}-01-01`, tomorrowKey, search.bucket);
    case "all":
      return buildPeriod("all", "All time", firstEntryKey ?? addDaysKey(tomorrowKey, -30), tomorrowKey, search.bucket);
    default:
      return buildPeriod("90d", "Last 90 days", addDaysKey(tomorrowKey, -90), tomorrowKey, search.bucket);
  }
}
