"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/helpers";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { ColorDot } from "@/components/color-dot";
import { chipSurface } from "@/lib/ui";
import { EditAccomplishmentForm } from "./edit-accomplishment-form";
import { ConfirmDialog } from "./confirm-dialog";
import { deleteAccomplishment, getAccomplishment } from "@/lib/actions";
import type {
  AccomplishmentItem,
  CategoryOption,
  TagOption,
} from "@/lib/types";

export function AccomplishmentsList({
  initialAccomplishments,
  categories,
  tags,
  isFiltered = false,
}: {
  initialAccomplishments: AccomplishmentItem[];
  /** Only needed to populate the edit dialog's dropdowns. */
  categories: CategoryOption[];
  tags: TagOption[];
  /** Switches the empty state between "nothing yet" and "nothing matched". */
  isFiltered?: boolean;
}) {
  const router = useRouter();
  const [accomplishments, setAccomplishments] = useState(
    initialAccomplishments,
  );
  const [editingAccomplishment, setEditingAccomplishment] =
    useState<AccomplishmentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Sync local state when initialAccomplishments changes (e.g., after adding new accomplishment)
  useEffect(() => {
    setAccomplishments(initialAccomplishments);
  }, [initialAccomplishments]);

  const handleEdit = async (id: string) => {
    const accomplishment = await getAccomplishment(id);
    if (accomplishment) {
      setEditingAccomplishment(accomplishment);
    }
  };

  const handleEditSuccess = (updatedAccomplishment: AccomplishmentItem) => {
    setAccomplishments((prev) =>
      prev.map((a) =>
        a.id === updatedAccomplishment.id ? updatedAccomplishment : a,
      ),
    );

    setEditingAccomplishment(null);

    // TODO: Not sure if we need to refresh to ensure data consistency?
    router.refresh();
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (!deletingId) return;

    startTransition(async () => {
      const result = await deleteAccomplishment(deletingId);
      if (result.success) {
        setAccomplishments((prev) => prev.filter((a) => a.id !== deletingId));
        setDeletingId(null);
      }
    });
  };

  return (
    <>
      {accomplishments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mb-4">
            <Calendar className="h-12 w-12 mx-auto text-kimberly" />
          </div>
          <h3 className="text-lg font-medium text-mischka mb-2">
            {isFiltered
              ? "No accomplishments match your filters"
              : "No accomplishments yet"}
          </h3>
          <p className="text-kimberly">
            {isFiltered
              ? "Try adjusting your search or filters."
              : "Start tracking your achievements by adding your first accomplishment above."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-kimberly/25">
          {accomplishments.map((accomplishment) => (
            <div
              key={accomplishment.id}
              className="p-6 bg-[#242438] hover:bg-ebony-clay/60 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-mischka group-hover:text-white transition-colors">
                      {accomplishment.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs text-mischka/85 ${chipSurface}`}
                    >
                      <ColorDot color={accomplishment.category.color} />
                      {accomplishment.category.name}
                    </span>
                  </div>

                  {accomplishment.description && (
                    <p className="text-ink-muted mb-3 leading-relaxed">
                      {accomplishment.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(accomplishment.date)}
                      {new Date(accomplishment.updatedAt).getTime() -
                        new Date(accomplishment.createdAt).getTime() >
                        1000 && (
                        <span
                          className="text-xs text-ink-muted/70 italic"
                          title={`Last edited ${new Date(
                            accomplishment.updatedAt,
                          ).toLocaleString()}`}
                        >
                          · edited
                        </span>
                      )}
                    </div>

                    {accomplishment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {accomplishment.tags.map(({ tag }) => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 text-xs text-ink-muted"
                          >
                            <ColorDot color={tag.color} />
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 no-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(accomplishment.id)}
                    className="p-2 text-blue-400 hover:bg-ebony-clay rounded-md transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ebony-clay"
                    aria-label="Edit accomplishment"
                    title="Edit accomplishment"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(accomplishment.id)}
                    className="p-2 text-red-400 hover:bg-ebony-clay rounded-md transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ebony-clay"
                    aria-label="Delete accomplishment"
                    title="Delete accomplishment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingAccomplishment && (
        <EditAccomplishmentForm
          accomplishment={editingAccomplishment}
          categories={categories}
          tags={tags}
          onClose={() => setEditingAccomplishment(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingId && (
        <ConfirmDialog
          title="Delete Accomplishment"
          message="Are you sure you want to delete this accomplishment? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}
