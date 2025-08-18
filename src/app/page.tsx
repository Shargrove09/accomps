import { Suspense } from "react";
import Link from "next/link";
import { AddAccomplishmentForm } from "@/components/add-accomplishment-form";
import { AccomplishmentsList } from "@/components/accomplishments-list";
import { StatsOverview } from "@/components/stats-overview";
import { Plus, TrendingUp, Calendar, Tag } from "lucide-react";

export default function Home() {
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
        fallback={<div className="animate-pulse bg-gray-200 rounded-lg h-32" />}
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
        <AddAccomplishmentForm />
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
          </div>
        </div>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 h-64" />}>
          <AccomplishmentsList />
        </Suspense>
      </div>

      {/* Quick Actions */}
      {/* Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/calendar">
          <div className="bg-east-bay rounded-lg shadow-sm border p-6 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-mischka mb-2">View Calendar</h3>
            <p className="text-sm text-steel-gray">
              See your accomplishments organized by date
            </p>
          </div>
        </Link>
        <Link href="/tags">
          <div className="bg-east-bay rounded-lg shadow-sm border p-6 text-center">
            <Tag className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-mischka mb-2">Manage Tags</h3>
            <p className="text-sm text-steel-gray">
              Organize and categorize your achievements
            </p>
          </div>
        </Link>
        <div className="bg-east-bay rounded-lg shadow-sm border p-6 text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-mischka  mb-2">View Analytics</h3>
          <p className="text-sm text-steel-gray ">
            Track your progress and patterns
          </p>
        </div>
      </div>
    </div>
  );
}
