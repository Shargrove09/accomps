import Link from "next/link";
import { getAccomplishmentStats } from "@/lib/actions";
import {
  ArrowUpRight,
  Award,
  Calendar,
  Flame,
  Folder,
  Tag,
} from "lucide-react";
import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";

export async function StatsOverview() {
  const { totals, trends } = await getAccomplishmentStats();

  // Each stat doubles as a shortcut to the page that owns that data.
  const stats = [
    {
      label: "Total Accomplishments",
      value: totals.total,
      href: "/accomplishments",
      icon: Award,
      accent: "text-blue-400",
      tint: "bg-blue-500/10",
      hoverBorder: "hover:border-blue-500/70",
      delay: "delay-0",
    },
    {
      label: "This Week",
      value: totals.thisWeek,
      href: "/calendar",
      icon: Calendar,
      accent: "text-green-400",
      tint: "bg-green-500/10",
      hoverBorder: "hover:border-green-500/70",
      delay: "delay-75",
      streak: trends.currentStreak,
    },
    {
      label: "Categories",
      value: totals.categories,
      href: "/categories",
      icon: Folder,
      accent: "text-purple-400",
      tint: "bg-purple-500/10",
      hoverBorder: "hover:border-purple-500/70",
      delay: "delay-150",
    },
    {
      label: "Tags",
      value: totals.tags,
      href: "/tags",
      icon: Tag,
      accent: "text-orange-400",
      tint: "bg-orange-500/10",
      hoverBorder: "hover:border-orange-500/70",
      delay: "delay-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.label}
            href={stat.href}
            aria-label={`${stat.label}: ${stat.value}`}
            className={cn(
              "group relative overflow-hidden rounded-lg border border-kimberly bg-ebony-clay p-6 text-center",
              "transition-[transform,border-color,box-shadow] duration-200 ease-out",
              "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-gray",
              // Staggered entrance; fill-mode-backwards holds each card hidden
              // until its own delay elapses instead of flashing in first.
              "animate-in fade-in slide-in-from-bottom-3 animation-duration-500 fill-mode-backwards",
              stat.hoverBorder,
              stat.delay
            )}
          >
            {/* Accent glow that only appears on hover, so the resting grid stays flat. */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                stat.tint
              )}
            />

            <ArrowUpRight
              aria-hidden="true"
              className="absolute right-3 top-3 h-4 w-4 text-kimberly opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />

            <div
              className={cn(
                "relative inline-flex h-12 w-12 items-center justify-center rounded-lg mb-3 transition-transform duration-200 group-hover:scale-110",
                stat.tint
              )}
            >
              <Icon className={cn("h-6 w-6", stat.accent)} />
            </div>

            <div className="relative mb-1 text-2xl font-bold tabular-nums text-mischka">
              <CountUp value={stat.value} />
            </div>

            <div className="relative text-sm text-mischka/70">{stat.label}</div>

            {stat.streak !== undefined && stat.streak > 0 && (
              <div className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-300">
                <Flame className="h-3 w-3" />
                {stat.streak} day streak
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
