import { getAccomplishmentsByTag } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

// Define a type for the accomplishment data structure
// This tells TypeScript what properties to expect on each accomplishment object.
type AccomplishmentWithCategory = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  category: {
    name: string;
  } | null;
};

interface TagPageProps {
  tagName: string;

  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function TagPage({
  params,
}: {
  params: Promise<TagPageProps>;
}) {
  const decodedTagName = decodeURIComponent((await params).tagName);
  const accomplishments = await getAccomplishmentsByTag(decodedTagName);

  if (accomplishments.length === 0) {
    notFound();
  }
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/tags"
            className="text-mischka outline outline-mischka bg-kimberly p-2 rounded-xl hover:text-mischka mb-2 inline-block"
          >
            ← Back to all tags
          </Link>
          <h1 className="text-3xl font-bold text-mischka">
            Tag: {decodedTagName}
          </h1>
          <p className="text-kimberly mt-2">
            {accomplishments.length} accomplishment
            {accomplishments.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {accomplishments.map((accomplishment: AccomplishmentWithCategory) => (
          <div
            key={accomplishment.id}
            className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly p-6"
          >
            <h3 className="text-xl font-semibold text-mischka mb-2">
              {accomplishment.title}
            </h3>
            {accomplishment.description && (
              <p className="text-kimberly mb-3">{accomplishment.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-kimberly">
              <span>{new Date(accomplishment.date).toLocaleDateString()}</span>
              {accomplishment.category && (
                <span className="px-2 py-1 bg-blue-900/30 rounded">
                  {accomplishment.category.name}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
