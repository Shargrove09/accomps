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
