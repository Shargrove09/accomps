import { cn } from "@/lib/utils";

const FALLBACK = "#6B7280";

/** A category/tag's stored color, shown as a small mark rather than a fill. */
export function ColorDot({
  color,
  className,
}: {
  color: string | null | undefined;
  className?: string;
}) {
  const safe = /^#[0-9a-f]{6}$/i.test(color ?? "") ? color! : FALLBACK;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: safe }}
    />
  );
}
