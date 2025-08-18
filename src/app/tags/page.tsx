import { getTagsWithAccomplishmentCount } from "@/lib/actions";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await getTagsWithAccomplishmentCount();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-mischka mb-4">All Tags</h1>
        <p className="text-lg text-kimberly max-w-2xl mx-auto">
          Browse all tags used to categorize your accomplishments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tags.map((tag) => (
          <Link href={`/tags/${tag.name}`} key={tag.id}>
            <div className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly p-6 text-center hover:border-blue-600 transition-colors">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: tag.color ?? "#ffffff" }}
                ></div>
                <h3
                  className="font-semibold text-mischka"
                  style={{ color: tag.color ?? "#ffffff" }}
                >
                  {tag.name}
                </h3>
              </div>
              <p className="text-sm text-steel-gray">
                {tag._count.accomplishments} accomplishment
                {tag._count.accomplishments !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
