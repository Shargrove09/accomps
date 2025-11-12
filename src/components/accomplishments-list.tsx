"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Calendar, Tag, Edit2, Trash2 } from "lucide-react";
import { EditAccomplishmentForm } from "./edit-accomplishment-form";
import { ConfirmDialog } from "./confirm-dialog";
import { deleteAccomplishment, getAccomplishment } from "@/lib/actions";

type Accomplishment = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  category: {
    id: string;
    name: string;
    color: string | null;
  };
  tags: {
    tag: {
      id: string;
      name: string;
      color: string | null;
    };
  }[];
};

export function AccomplishmentsList({
  initialAccomplishments,
}: {
  initialAccomplishments: Accomplishment[];
}) {
  const router = useRouter();
  const [accomplishments, setAccomplishments] = useState(
    initialAccomplishments
  );
  const [editingAccomplishment, setEditingAccomplishment] =
    useState<Accomplishment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleEdit = async (id: string) => {
    const accomplishment = await getAccomplishment(id);
    if (accomplishment) {
      setEditingAccomplishment(accomplishment);
    }
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

  const refreshList = () => {
    router.refresh();
  };

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
    <>
      <div className="divide-y divide-gray-100">
        {accomplishments.map((accomplishment) => (
          <div
            key={accomplishment.id}
            className="p-6 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 transition-colors">
                    {accomplishment.title}
                  </h3>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor:
                        accomplishment.category.color || "#6B7280",
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

              <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(accomplishment.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit accomplishment"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(accomplishment.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete accomplishment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingAccomplishment && (
        <EditAccomplishmentForm
          accomplishment={editingAccomplishment}
          onClose={() => setEditingAccomplishment(null)}
          onSuccess={refreshList}
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

