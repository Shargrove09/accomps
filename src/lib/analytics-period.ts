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
