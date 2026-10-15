import { ColorDot } from "@/components/color-dot";
import { DeltaPill } from "@/components/analytics/delta-pill";

type Item = { id: string; name: string; color: string | null; count: number; prevCount: number };

const MAX_ROWS = 8;
const barColor = (c: string | null) => (/^#[0-9a-f]{6}$/i.test(c ?? "") ? c! : "#6B7280");

export function RankedBars({
  items,
  total,
  showDeltas,
  comparable,
}: {
  items: Item[];
  total: number;
  showDeltas: boolean;
  comparable: boolean;
}) {
  if (items.length === 0) return <p className="text-sm text-ink-muted">Nothing in this period.</p>;
  if (items.length === 1) {
    return (
      <p className="flex items-center gap-2 text-mischka">
        <ColorDot color={items[0].color} className="h-2.5 w-2.5" />
        Everything here is {items[0].name} ({items[0].count}).
      </p>
    );
  }

  const shown = items.slice(0, MAX_ROWS);
  const top = shown[0].count;
  return (
    <ul className="space-y-3">
      {shown.map((it) => (
        <li key={it.id} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm">
          <span className="flex min-w-0 items-center gap-2 text-mischka">
            <ColorDot color={it.color} className="h-2.5 w-2.5" />
            <span className="truncate">{it.name}</span>
          </span>
          <span className="h-2 overflow-hidden rounded-full bg-east-bay/40">
            <span
              className="block h-full rounded-full"
              style={{ width: `${(it.count / top) * 100}%`, backgroundColor: barColor(it.color) }}
            />
          </span>
          <span className="flex min-w-24 items-center justify-end gap-2 tabular-nums text-ink-muted">
            {it.count}
            <span className="hidden sm:inline">· {total ? Math.round((it.count / total) * 100) : 0}%</span>
            {showDeltas && (
              <DeltaPill
                comparable={comparable}
                delta={{
                  current: it.count,
                  previous: it.prevCount,
                  diff: it.count - it.prevCount,
                  pct: it.prevCount === 0 ? null : (it.count - it.prevCount) / it.prevCount,
                }}
              />
            )}
          </span>
        </li>
      ))}
      {items.length > MAX_ROWS && (
        <li className="text-xs text-ink-muted">+{items.length - MAX_ROWS} more</li>
      )}
    </ul>
  );
}
