"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { AddAccomplishmentForm } from "@/components/add-accomplishment-form";
import { cn } from "@/lib/utils";
import { focusRing } from "@/lib/ui";
import type { CategoryOption, TagOption } from "@/lib/types";

/** Fired by OpenAddPanelButton (and anything else) to expand the panel. */
export const OPEN_ADD_PANEL_EVENT = "accomps:open-add-panel";

const STORAGE_KEY = "accomps:add-panel-open";
/** Matches the grid-rows transition below, so focus lands once the form is visible. */
const EXPAND_MS = 300;

// Open state lives in a tiny external store backed by localStorage, read via
// useSyncExternalStore: the server snapshot is "collapsed", so hydration matches
// and the stored choice applies right after. The in-memory copy keeps the
// toggle working when storage is blocked (private windows, previews).
let openState: boolean | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getOpen() {
  if (openState === null) {
    try {
      openState = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      openState = false;
    }
  }
  return openState;
}

function setOpen(next: boolean) {
  openState = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {}
  listeners.forEach((listener) => listener());
}

export function AddAccomplishmentPanel({
  categories,
  tags,
}: {
  categories: CategoryOption[];
  tags: TagOption[];
}) {
  const open = useSyncExternalStore(subscribe, getOpen, () => false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        panelRef.current
          ?.querySelector<HTMLInputElement>("#title")
          ?.focus({ preventScroll: true });
      }, EXPAND_MS);
    };
    window.addEventListener(OPEN_ADD_PANEL_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_ADD_PANEL_EVENT, handleOpen);
  }, []);

  return (
    <section
      ref={panelRef}
      className="scroll-mt-8 rounded-lg border border-kimberly bg-ebony-clay shadow-sm"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="add-panel-body"
        onClick={() => setOpen(!open)}
        className={cn(
          "group flex w-full items-center gap-2 rounded-lg px-6 text-left transition-[padding] duration-300 hover:cursor-pointer",
          open ? "pt-6 pb-0" : "py-4",
          focusRing,
        )}
      >
        <Plus className="h-5 w-5 text-ink-muted transition-colors group-hover:text-mischka" />
        <h2 className="text-xl font-semibold text-mischka">
          Add New Accomplishment
        </h2>
        <span
          className={cn(
            "ml-auto hidden text-sm text-ink-muted transition-opacity duration-200 sm:inline",
            open && "opacity-0",
          )}
        >
          Log something you did today
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300 group-hover:text-mischka max-sm:ml-auto",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        id="add-panel-body"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        {/* inert keeps the collapsed fields out of the tab order; the form stays
            mounted so a half-typed entry survives collapsing. */}
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className="px-6 pt-4 pb-6">
            <AddAccomplishmentForm
              categories={categories}
              tags={tags}
              onAdded={() => setOpen(false)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
