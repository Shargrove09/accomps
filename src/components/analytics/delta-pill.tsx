import { cn } from "@/lib/utils";
import type { Delta } from "@/lib/analytics";

/** Direction is conveyed by arrow and sign, never by color alone. */
export function DeltaPill({ delta, comparable }: { delta: Delta; comparable: boolean }) {
  if (!comparable) {
    return (
      <span title="Not enough history to compare" className="text-xs text-ink-muted">
        —
      </span>
    );
  }
  if (delta.pct === null) {
    return <span className="text-xs text-ink-muted">{delta.current > 0 ? "New" : "—"}</span>;
  }
  const pct = Math.round(delta.pct * 100);
  const up = pct > 0;
  const flat = pct === 0;
  return (
    <span
      title={`${delta.previous} in the previous period`}
      className={cn("text-xs tabular-nums", flat ? "text-ink-muted" : up ? "text-emerald-300" : "text-amber-300")}
    >
      {flat ? "■" : up ? "▲" : "▼"} {up ? "+" : ""}
      {pct}%
    </span>
  );
}
