import { ColorDot } from "@/components/color-dot";
import { chipSurface, safeColor } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { AccomplishmentItem } from "@/lib/types";

/** One entry in full; the left spine matches its chip in the grid. */
export function EntryCard({
  entry,
  clamp = false,
}: {
  entry: AccomplishmentItem;
  clamp?: boolean;
}) {
  return (
    <article
      className="rounded-md border border-kimberly/40 bg-steel-gray/60 p-3"
      style={{ borderLeft: `3px solid ${safeColor(entry.category.color)}` }}
    >
      <h3 className="font-semibold leading-snug text-mischka">{entry.title}</h3>
      {entry.description && (
        <p
          className={cn(
            "mt-1 text-sm leading-relaxed text-ink-muted",
            clamp ? "line-clamp-3" : "max-w-[70ch]",
          )}
        >
          {entry.description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs text-mischka/85 ${chipSurface}`}
        >
          <ColorDot color={entry.category.color} />
          {entry.category.name}
        </span>
        {entry.tags.map(({ tag }) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted"
          >
            <ColorDot color={tag.color} />
            {tag.name}
          </span>
        ))}
      </div>
    </article>
  );
}
