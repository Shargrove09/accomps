import { getTagsWithAccomplishmentCount } from "@/lib/actions";
import { CategoryTagManager, type ManagedItem } from "@/components/category-tag-manager";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const tags = await getTagsWithAccomplishmentCount();

  const items: ManagedItem[] = tags.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    description: t.description,
    count: t._count.accomplishments,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-mischka">All Tags</h1>
        <p className="text-lg text-kimberly max-w-2xl mx-auto">
          Browse and manage the tags used to categorize your accomplishments.
        </p>
      </div>

      <CategoryTagManager kind="tag" items={items} hrefBase="/tags/" />
    </div>
  );
}
