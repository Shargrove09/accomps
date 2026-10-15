import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { btnPrimary } from "@/lib/ui";

export function EmptyAnalytics() {
  return (
    <div className="rounded-lg border border-dashed border-kimberly bg-ebony-clay/60 p-10 text-center">
      <BarChart3 aria-hidden="true" className="mx-auto mb-3 h-8 w-8 text-ink-muted" />
      <h2 className="mb-1 text-xl font-semibold text-mischka">Nothing to chart yet</h2>
      <p className="mb-5 text-sm text-ink-muted">Log an accomplishment and your trends will show up here.</p>
      <Link href="/" className={btnPrimary}>
        Log your first accomplishment
      </Link>
    </div>
  );
}
