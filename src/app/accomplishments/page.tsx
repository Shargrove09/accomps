import { Suspense } from "react";
import { db } from "@/lib/db";
import { getCategories, getExistingTags } from "@/lib/actions";
import { AccomplishmentsList } from "@/components/accomplishments-list";
import { TrendingUp } from "lucide-react";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

async function AllAccomplishments() {
  const [accomplishments, categories, tags] = await Promise.all([
    db.accomplishment.findMany({
      orderBy: { date: "desc" },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    getCategories(),
    getExistingTags(),
  ]);

  return (
    <AccomplishmentsList
      initialAccomplishments={accomplishments}
      categories={categories}
      tags={tags}
    />
  );
}

export default function AccomplishmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-mischka mb-2">
          All Accomplishments
        </h1>
        <p className="text-kimberly">
          Browse, search, and filter all your accomplishments in one place.
        </p>
      </div>

      {/* Accomplishments List with Filters */}
      <div className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly">
        <div className="p-6 border-b border-kimberly">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-mischka">
              Your Achievements
            </h2>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="animate-pulse bg-ebony-clay h-96 rounded-b-lg" />
          }
        >
          <AllAccomplishments />
        </Suspense>
      </div>
    </div>
  );
}
