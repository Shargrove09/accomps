"use client";

import { Plus } from "lucide-react";
import { OPEN_ADD_PANEL_EVENT } from "@/components/add-accomplishment-panel";
import { cn } from "@/lib/utils";
import { btnPrimary, focusRing } from "@/lib/ui";

export function OpenAddPanelButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_ADD_PANEL_EVENT))}
      className={cn(btnPrimary, focusRing, "inline-flex items-center gap-2 self-start sm:self-auto")}
    >
      <Plus className="h-4 w-4" />
      Add accomplishment
    </button>
  );
}
