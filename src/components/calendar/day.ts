import { format } from "date-fns";

/** Browser-local midnight of a YYYY-MM-DD ledger day. */
export function keyToLocalDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const dateToKey = (d: Date) => format(d, "yyyy-MM-dd");

export const entryCount = (n: number) => `${n} ${n === 1 ? "entry" : "entries"}`;
