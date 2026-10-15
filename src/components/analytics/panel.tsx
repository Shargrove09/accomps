import { cn } from "@/lib/utils";

export function Panel({
  title,
  hint,
  className,
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border border-kimberly bg-ebony-clay p-6 shadow-sm", className)}>
      <h2 className="text-xl font-semibold text-mischka">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
