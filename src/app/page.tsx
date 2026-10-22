import { Suspense } from "react";
import Link from "next/link";
import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";
import { AddAccomplishmentPanel } from "@/components/add-accomplishment-panel";
import { OpenAddPanelButton } from "@/components/open-add-panel-button";
import { AccomplishmentsList } from "@/components/accomplishments-list";
import { StatsOverview } from "@/components/stats-overview";
import { ArrowUpRight, Calendar, Folder, Tag, TrendingUp } from "lucide-react";
import { db } from "@/lib/db";
import { getCategories, getExistingTags } from "@/lib/actions";
import { APP_TZ } from "@/lib/analytics-period";
import { cn } from "@/lib/utils";
import type { CategoryOption, TagOption } from "@/lib/types";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  {
    href: "/calendar",
    icon: Calendar,
    title: "View Calendar",
    description: "See your accomplishments organized by date",
    delay: "delay-0",
  },
  {
    href: "/categories",
    icon: Folder,
    title: "Manage Categories",
    description: "Rename, recolor, and merge your categories",
    delay: "delay-75",
  },
  {
    href: "/tags",
    icon: Tag,
    title: "Manage Tags",
    description: "Organize and categorize your achievements",
    delay: "delay-150",
  },
  {
    href: "/analytics",
    icon: TrendingUp,
    title: "View Analytics",
    description: "Track your progress and patterns",
    delay: "delay-200",
  },
];

async function RecentAccomplishments({
  categories,
  tags,
}: {
  categories: CategoryOption[];
  tags: TagOption[];
}) {
  const accomplishments = await db.accomplishment.findMany({
    take: 10,
    orderBy: { date: "desc" },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return (
    <AccomplishmentsList
      initialAccomplishments={accomplishments}
      categories={categories}
      tags={tags}
    />
  );
}

export default async function Home() {
  // Passed to RecentAccomplishments to avoid fetching categories and tags twice
  const [categories, tags] = await Promise.all([
    getCategories(),
    getExistingTags(),
  ]);
  const now = TZDate.tz(APP_TZ);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mischka">
            {greeting(now.getHours())}
          </h1>
          <p className="mt-1 text-lg text-ink-muted">
            {format(now, "EEEE, MMMM d")}
          </p>
        </div>
        <OpenAddPanelButton />
      </div>

      {/* Quick Stats */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="h-38 animate-pulse rounded-lg border border-kimberly bg-ebony-clay"
              />
            ))}
          </div>
        }
      >
        <StatsOverview />
      </Suspense>

      {/* Add New Accomplishment */}
      <AddAccomplishmentPanel categories={categories} tags={tags} />

      {/* Recent Accomplishments */}
      <div className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly ">
        <div className="p-6 border-b border-kimberly ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-ink-muted" />
              <h2 className="text-xl font-semibold text-mischka">
                Recent Accomplishments
              </h2>
            </div>
            <Link
              href="/accomplishments"
              className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-mischka hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
        <Suspense
          fallback={<div className="h-64 animate-pulse bg-east-bay/30" />}
        >
          <RecentAccomplishments categories={categories} tags={tags} />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-mischka">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-kimberly bg-ebony-clay p-6 text-center",
                  "transition-[transform,border-color,box-shadow] duration-200 ease-out",
                  "hover:-translate-y-1 hover:border-mischka/40 hover:shadow-lg hover:shadow-black/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ebony-clay",
                  "animate-in fade-in slide-in-from-bottom-3 animation-duration-500 fill-mode-backwards",
                  action.delay,
                )}
              >
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-3 top-3 h-4 w-4 text-kimberly opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />

                <Icon className="relative mx-auto mb-3 h-7 w-7 text-periwinkle transition-transform duration-200 group-hover:-translate-y-0.5" />
                <h3 className="relative mb-2 font-semibold text-mischka">
                  {action.title}
                </h3>
                <p className="relative text-sm text-ink-muted">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
