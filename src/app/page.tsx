import { Suspense } from "react";
import Link from "next/link";
import { AddAccomplishmentForm } from "@/components/add-accomplishment-form";
import { AccomplishmentsList } from "@/components/accomplishments-list";
import { StatsOverview } from "@/components/stats-overview";
import {
  ArrowUpRight,
  Calendar,
  Folder,
  Plus,
  Tag,
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db";
import { getCategories, getExistingTags } from "@/lib/actions";
import { cn } from "@/lib/utils";
import type { CategoryOption, TagOption } from "@/lib/types";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  {
    href: "/calendar",
    icon: Calendar,
    title: "View Calendar",
    description: "See your accomplishments organized by date",
    accent: "text-blue-400",
    tint: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/70",
    delay: "delay-0",
  },
  {
    href: "/categories",
    icon: Folder,
    title: "Manage Categories",
    description: "Rename, recolor, and merge your categories",
    accent: "text-purple-400",
    tint: "bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/70",
    delay: "delay-75",
  },
  {
    href: "/tags",
    icon: Tag,
    title: "Manage Tags",
    description: "Organize and categorize your achievements",
    accent: "text-orange-400",
    tint: "bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/70",
    delay: "delay-150",
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
  // Read once here and pass down. Both the add form and the list need these,
  // and the forms used to fetch them again from the client on mount — which
  // meant the dropdowns stayed empty until hydration plus a round trip.
  // These two queries are small and indexed; the expensive reads stay inside
  // the Suspense boundaries below so the shell still flushes early.
  const [categories, tags] = await Promise.all([
    getCategories(),
    getExistingTags(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-mischka mb-4">
          Track Your Daily Accomplishments
        </h1>
        <p className="text-lg text-kimberly max-w-2xl mx-auto">
          Record your achievements, organize them with tags and categories, and
          visualize your progress over time.
        </p>
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
      <div className="bg-ebony-clay  rounded-lg shadow-sm border border-kimberly p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-mischka">
            Add New Accomplishment
          </h2>
        </div>
        <AddAccomplishmentForm categories={categories} tags={tags} />
      </div>

      {/* Recent Accomplishments */}
      <div className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly ">
        <div className="p-6 border-b border-kimberly ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-mischka">
                Recent Accomplishments
              </h2>
            </div>
            <Link
              href="/accomplishments"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
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
                  "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-gray",
                  "animate-in fade-in slide-in-from-bottom-3 animation-duration-500 fill-mode-backwards",
                  action.hoverBorder,
                  action.delay
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute inset-x-0 -top-16 h-32 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                    action.tint
                  )}
                />

                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-3 top-3 h-4 w-4 text-kimberly opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                />

                <Icon
                  className={cn(
                    "relative mx-auto mb-3 h-8 w-8 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110",
                    action.accent
                  )}
                />
                <h3 className="relative mb-2 font-semibold text-mischka">
                  {action.title}
                </h3>
                <p className="relative text-sm text-mischka/70">
                  {action.description}
                </p>
              </Link>
            );
          })}

          <div className="relative rounded-lg border border-dashed border-kimberly bg-ebony-clay/60 p-6 text-center opacity-60">
            <span className="absolute right-3 top-3 rounded-full bg-east-bay px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-mischka/80">
              Soon
            </span>
            <TrendingUp className="mx-auto mb-3 h-8 w-8 text-green-400" />
            <h3 className="mb-2 font-semibold text-mischka">View Analytics</h3>
            <p className="text-sm text-mischka/70">
              Track your progress and patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
