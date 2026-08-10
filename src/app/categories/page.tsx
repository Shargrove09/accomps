import { getCategoriesWithAccomplishmentCount } from "@/lib/actions";
import { CategoryTagManager, type ManagedItem } from "@/components/category-tag-manager";

// Mark this page as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithAccomplishmentCount();

  const items: ManagedItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
    description: c.description,
    count: c._count.accomplishments,
  }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-mischka">Categories</h1>
        <p className="text-lg text-kimberly max-w-2xl mx-auto">
          Manage the categories used to organize your accomplishments. Rename,
          recolor, or merge them.
        </p>
      </div>

      <CategoryTagManager kind="category" items={items} />
    </div>
  );
}
