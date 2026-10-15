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
import { DotRow, SegmentedBar, WeekStrip, currentWeek } from "@/components/stat-visuals";

export async function StatsOverview() {
  const { totals, trends, byCategory, byTag } = await getAccomplishmentStats();

  // Each stat doubles as a shortcut to the page that owns that data.
  const stats = [
    {
      label: "Total Accomplishments",
      value: totals.total,
      href: "/accomplishments",
      icon: Award,
      visual: <SegmentedBar items={byCategory} />,
      delay: "delay-0",
    },
    {
      label: "This Week",
      value: totals.thisWeek,
      href: "/calendar",
      icon: Calendar,
      visual: <WeekStrip days={currentWeek(trends.perDay)} />,
      delay: "delay-75",
      streak: trends.currentStreak,
    },
    {
      label: "Categories",
      value: totals.categories,
      href: "/categories",
      icon: Folder,
      visual: <DotRow items={byCategory} total={totals.categories} />,
      delay: "delay-150",
    },
    {
      label: "Tags",
      value: totals.tags,
      href: "/tags",
      icon: Tag,
      visual: <DotRow items={byTag} total={totals.tags} />,
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
              "hover:-translate-y-1 hover:border-mischka/40 hover:shadow-lg hover:shadow-black/30",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ebony-clay",
              // Staggered entrance; fill-mode-backwards holds each card hidden
              // until its own delay elapses instead of flashing in first.
              "animate-in fade-in slide-in-from-bottom-3 animation-duration-500 fill-mode-backwards",
              stat.delay
            )}
          >
            <ArrowUpRight
              aria-hidden="true"
              className="absolute right-3 top-3 h-4 w-4 text-kimberly opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
            />

            <Icon className="relative mx-auto mb-3 h-6 w-6 text-ink-muted transition-colors duration-200 group-hover:text-mischka" />

            <div className="relative mb-1 text-2xl font-bold tabular-nums text-mischka">
              <CountUp value={stat.value} />
            </div>

            <div className="relative text-sm text-ink-muted">{stat.label}</div>

            <div className="relative">{stat.visual}</div>

            {stat.streak !== undefined && stat.streak > 0 && (
              <div className="relative mt-2 inline-flex items-center gap-1 text-xs text-ink-muted">
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
