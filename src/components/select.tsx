"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { ColorDot } from "@/components/color-dot";
import { cn } from "@/lib/utils";
import { fieldInput } from "@/lib/ui";

export type SelectOption = {
  value: string;
  label: string;
  /** Stored category/tag color, shown as a dot. */
  color?: string | null;
  /** Quiet right-aligned detail, e.g. a count. */
  hint?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  /** A row that clears the value, e.g. "Don't merge — just delete". */
  clearLabel?: string;
  /** Pinned footer row, e.g. "Create new category". */
  action?: { label: string; onSelect: () => void };
  /** Search box; "auto" shows it once there are more than 7 options. */
  searchable?: boolean | "auto";
  /** Stay open after picking, for adding several tags in a row. */
  keepOpen?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
};

const MENU_MAX = 288;

export function Select({
  value,
  onChange,
  options,
  placeholder,
  clearLabel,
  action,
  searchable = "auto",
  keepOpen = false,
  required,
  id,
  className,
}: Props) {
  const uid = useId();
  const listId = `${uid}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);

  const showSearch = searchable === true || (searchable === "auto" && options.length > 7);
  const selected = options.find((o) => o.value === value);

  // Rows in render order: optional clear row, filtered options, optional action.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
    return [
      ...(clearLabel && !q ? [{ kind: "clear" as const }] : []),
      ...filtered.map((o) => ({ kind: "option" as const, option: o })),
      ...(action ? [{ kind: "action" as const }] : []),
    ];
  }, [options, query, clearLabel, action]);

  const close = (refocus = true) => {
    setOpen(false);
    setQuery("");
    if (refocus) trigger.current?.focus();
  };

  const openMenu = () => {
    const idx = rows.findIndex((r) => r.kind === "option" && r.option.value === value);
    setActive(Math.max(0, idx));
    setOpen(true);
  };

  const choose = (i: number) => {
    const row = rows[i];
    if (!row) return;
    if (row.kind === "action") {
      close(false);
      action!.onSelect();
      return;
    }
    onChange(row.kind === "clear" ? "" : row.option.value);
    if (keepOpen) setQuery("");
    else close();
  };

  // Place the menu against the trigger; flip upward when there's no room below.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = trigger.current?.getBoundingClientRect();
      if (!r) return;
      const below = window.innerHeight - r.bottom;
      const flip = below < Math.min(MENU_MAX, 200) && r.top > below;
      setPos({
        left: r.left,
        width: r.width,
        ...(flip ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  // The menu mounts one render after `open`, once it has a position.
  const placed = pos !== null;
  useEffect(() => {
    if (open && placed) (showSearch ? search.current : menu.current)?.focus();
  }, [open, placed, showSearch]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menu.current?.contains(t) && !trigger.current?.contains(t)) close(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) menu.current?.querySelector(`[data-row="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onMenuKey = (e: React.KeyboardEvent) => {
    const last = rows.length - 1;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(last, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(last); }
    else if (e.key === "Enter") { e.preventDefault(); choose(active); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "Tab") close(false);
  };

  const rowClass = (i: number) =>
    cn(
      "flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-mischka/90",
      active === i && "bg-east-bay/60 text-mischka",
    );

  return (
    <div className={cn("relative", className)}>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); openMenu(); }
        }}
        className={cn(
          fieldInput,
          "flex items-center gap-2.5 text-left hover:cursor-pointer",
          open && "border-transparent ring-2 ring-blue-500",
        )}
      >
        {selected ? (
          <>
            {selected.color !== undefined && <ColorDot color={selected.color} className="h-2.5 w-2.5" />}
            <span className="truncate">{selected.label}</span>
          </>
        ) : (
          <span className="truncate text-kimberly">{placeholder}</span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={cn("ml-auto h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {/* Keeps native form validation working for `required` pickers. */}
      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => {}}
          onFocus={() => trigger.current?.focus()}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0"
        />
      )}

      {open && pos &&
        createPortal(
          <div
            ref={menu}
            tabIndex={-1}
            onKeyDown={onMenuKey}
            style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: MENU_MAX }}
            className="fixed z-[70] flex flex-col overflow-hidden rounded-md border border-kimberly/50 bg-steel-gray shadow-2xl shadow-black/60 outline-none animate-in fade-in zoom-in-95 animation-duration-100"
          >
            {showSearch && (
              <div className="relative border-b border-kimberly/30">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  ref={search}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                  placeholder="Search…"
                  aria-label="Search options"
                  aria-controls={listId}
                  aria-activedescendant={`${uid}-row-${active}`}
                  className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-mischka placeholder-kimberly outline-none"
                />
              </div>
            )}

            <div id={listId} role="listbox" className="scroll-slim overflow-y-auto py-1">
              {rows.map((row, i) => {
                const rid = `${uid}-row-${i}`;
                if (row.kind === "clear") {
                  return (
                    <div key="clear" id={rid} data-row={i} role="option" aria-selected={value === ""}
                      onMouseMove={() => setActive(i)} onClick={() => choose(i)}
                      className={cn(rowClass(i), "text-ink-muted")}>
                      {clearLabel}
                    </div>
                  );
                }
                if (row.kind === "action") {
                  return (
                    <div key="action" id={rid} data-row={i} role="option" aria-selected={false}
                      onMouseMove={() => setActive(i)} onClick={() => choose(i)}
                      className={cn(rowClass(i), "mt-1 border-t border-kimberly/30 pt-2.5 text-periwinkle")}>
                      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      {action!.label}
                    </div>
                  );
                }
                const o = row.option;
                const isSel = o.value === value;
                return (
                  <div key={o.value} id={rid} data-row={i} role="option" aria-selected={isSel}
                    onMouseMove={() => setActive(i)} onClick={() => choose(i)} className={rowClass(i)}>
                    {o.color !== undefined && <ColorDot color={o.color} className="h-2.5 w-2.5" />}
                    <span className={cn("min-w-0 flex-1 truncate", isSel && "font-medium")}>{o.label}</span>
                    {o.hint && <span className="text-xs tabular-nums text-ink-muted">{o.hint}</span>}
                    {isSel && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-periwinkle" />}
                  </div>
                );
              })}
              {rows.every((r) => r.kind !== "option") && query && (
                <p className="px-3 py-2 text-sm text-ink-muted">No match for “{query}”</p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
