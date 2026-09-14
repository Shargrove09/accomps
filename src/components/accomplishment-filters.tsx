"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import type { CategoryOption, TagOption } from "@/lib/types";

const PILL_BASE =
  "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:cursor-pointer";

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
    });
  };

  const selectedCategories = params.getAll("cat");
  const selectedTags = params.getAll("tag");
  const activeCount =
    (params.get("q") ? 1 : 0) + selectedCategories.length + selectedTags.length;

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
        <div>
          <label className="text-sm font-medium text-kimberly mb-2 block">
            Categories
          </label>
          <div className="flex flex-wrap gap-2 pt-1 pl-1 max-h-24 overflow-y-auto scroll-slim">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.name);
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle("cat", category.name)}
                  className={`${PILL_BASE} ${
                    isSelected
                      ? "text-white ring-2 ring-white"
                      : "text-white opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: category.color || "#6B7280" }}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <label className="text-sm font-medium text-kimberly mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 pt-1 pl-1 max-h-24 overflow-y-auto scroll-slim">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggle("tag", tag.name)}
                  className={`${PILL_BASE} ${
                    isSelected
                      ? "text-white ring-2 ring-white"
                      : "text-white opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: tag.color || "#6B7280" }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-kimberly">
            {activeCount} filter{activeCount !== 1 ? "s" : ""} active
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-mischka bg-east-bay hover:bg-kimberly rounded-md transition-colors hover:cursor-pointer"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
