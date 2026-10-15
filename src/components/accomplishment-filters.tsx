"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2, Search, X } from "lucide-react";
import { ColorDot } from "@/components/color-dot";
import { chipBase, chipIdle, chipOnStyle, focusRing } from "@/lib/ui";
import type { CategoryOption, TagOption } from "@/lib/types";

/** How many chips a group shows before collapsing behind "+N more". */
const COLLAPSED_COUNT = 10;

function PillGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: (CategoryOption | TagOption)[];
  selected: string[];
  onToggle: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Keep source order, but never collapse an active chip.
  const visible = expanded
    ? items
    : items.filter((it, i) => i < COLLAPSED_COUNT || selected.includes(it.name));
  const hidden = items.length - visible.length;

  return (
    <div>
      <label className="text-sm font-medium text-ink-muted mb-2 block">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {visible.map((item) => {
          const isSelected = selected.includes(item.name);
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(item.name)}
              className={`${chipBase} ${isSelected ? "font-medium" : chipIdle}`}
              style={isSelected ? chipOnStyle(item.color) : undefined}
            >
              {isSelected ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : (
                <ColorDot color={item.color} className="h-2.5 w-2.5" />
              )}
              {item.name}
            </button>
          );
        })}

        {(hidden > 0 || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={`inline-flex items-center rounded-md border border-dashed border-kimberly/40 px-3 py-1 text-sm text-ink-muted transition-colors hover:text-mischka hover:cursor-pointer ${focusRing}`}
          >
            {expanded ? "Show less" : `+${hidden} more`}
          </button>
        )}
      </div>
    </div>
  );
}

export function AccomplishmentFilters({
  categories,
  tags,
}: {
  categories: CategoryOption[];
  tags: TagOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // The URL is the filter state; this component only edits it.
  const commit = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("page");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const onSearch = (value: string) => {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      commit((next) => {
        if (value) next.set("q", value);
        else next.delete("q");
      });
    }, 300);
  };

  const toggle = (key: "cat" | "tag", value: string) => {
    commit((next) => {
      const current = next.getAll(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      next.delete(key);
      updated.forEach((v) => next.append(key, v));
    });
  };

  const clearAll = () => {
    setText("");
    clearTimeout(timer.current);
    commit((next) => {
      next.delete("q");
      next.delete("cat");
      next.delete("tag");
      next.delete("from");
      next.delete("to");
    });
  };

  const setDay = (key: "from" | "to", value: string) => {
    commit((next) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
  };

  const selectedCategories = params.getAll("cat");
  const selectedTags = params.getAll("tag");
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const activeCount =
    (params.get("q") ? 1 : 0) +
    selectedCategories.length +
    selectedTags.length +
    (from || to ? 1 : 0);

  return (
    <div className="p-4 border-b border-kimberly space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kimberly" />
        <input
          type="search"
          value={text}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search accomplishments..."
          className="w-full pl-10 pr-10 py-2 bg-ebony-clay border border-kimberly rounded-md text-mischka placeholder-kimberly focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isPending && (
          <Loader2
            aria-label="Searching"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-kimberly"
          />
        )}
      </div>

      {categories.length > 0 && (
        <PillGroup
          label="Categories"
          items={categories}
          selected={selectedCategories}
          onToggle={(name) => toggle("cat", name)}
        />
      )}

      {tags.length > 0 && (
        <PillGroup
          label="Tags"
          items={tags}
          selected={selectedTags}
          onToggle={(name) => toggle("tag", name)}
        />
      )}

      <fieldset>
        <legend className="text-sm font-medium text-ink-muted mb-2">Date range</legend>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <input
            key={`from-${from}`}
            type="date"
            aria-label="From date"
            defaultValue={from}
            max={to || undefined}
            onChange={(e) => setDay("from", e.target.value)}
            className="rounded-md border border-kimberly bg-ebony-clay px-3 py-1.5 text-mischka focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          to
          <input
            key={`to-${to}`}
            type="date"
            aria-label="To date"
            defaultValue={to}
            min={from || undefined}
            onChange={(e) => setDay("to", e.target.value)}
            className="rounded-md border border-kimberly bg-ebony-clay px-3 py-1.5 text-mischka focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </fieldset>

      {activeCount > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-kimberly tabular-nums">
            {activeCount} filter{activeCount !== 1 ? "s" : ""} active
          </span>
          <button
            type="button"
            onClick={clearAll}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-mischka bg-east-bay hover:bg-kimberly rounded-md transition-colors hover:cursor-pointer ${focusRing}`}
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
