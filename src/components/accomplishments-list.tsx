import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Calendar, Tag } from "lucide-react";

export async function AccomplishmentsList() {
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

  if (accomplishments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mb-4">
          <Calendar className="h-12 w-12 mx-auto text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No accomplishments yet
        </h3>
        <p className="text-gray-600">
          Start tracking your achievements by adding your first accomplishment
          above.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {accomplishments.map((accomplishment) => (
        <div
          key={accomplishment.id}
          className="p-6 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {accomplishment.title}
                </h3>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{
                    backgroundColor: accomplishment.category.color || "#6B7280",
                  }}
                >
                  {accomplishment.category.name}
                </span>
              </div>

              {accomplishment.description && (
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {accomplishment.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(accomplishment.date)}
                </div>

                {accomplishment.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <div className="flex gap-1">
                      {accomplishment.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color || "#6B7280" }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
