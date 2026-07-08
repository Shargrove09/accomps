"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, Trash2, X } from "lucide-react";
import {
  updateCategory,
  deleteCategory,
  mergeCategory,
  updateTag,
  deleteTag,
  mergeTag,
} from "@/lib/actions";

export type ManagedItem = {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  count: number;
};

// Mirrors RANDOM_COLORS in actions.ts so the UI palette matches auto-assigned colors.
const PALETTE = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#F97316",
];

export function CategoryTagManager({
  kind,
  items,
  hrefBase,
}: {
  kind: "category" | "tag";
  items: ManagedItem[];
  /** When set, item names link to `${hrefBase}${name}` (e.g. "/tags/"). */
  hrefBase?: string;
}) {
  const [editing, setEditing] = useState<ManagedItem | null>(null);
  const [deleting, setDeleting] = useState<ManagedItem | null>(null);

  const label = kind === "category" ? "Category" : "Tag";

  return (
    <>
      {items.length === 0 ? (
        <p className="text-center text-kimberly">
          No {label.toLowerCase()}s yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-ebony-clay rounded-lg shadow-sm border border-kimberly p-6 text-center hover:border-blue-600 transition-colors group relative"
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditing(item)}
                  className="p-1.5 text-blue-400 hover:bg-east-bay rounded-md transition-colors hover:cursor-pointer"
                  title={`Edit ${label.toLowerCase()}`}
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleting(item)}
                  className="p-1.5 text-red-400 hover:bg-east-bay rounded-md transition-colors hover:cursor-pointer"
                  title={`Delete ${label.toLowerCase()}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: item.color ?? "#ffffff" }}
                />
                {hrefBase ? (
                  <Link
                    href={`${hrefBase}${item.name}`}
                    className="font-semibold hover:underline"
                    style={{ color: item.color ?? "#ffffff" }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <h3
                    className="font-semibold text-mischka"
                    style={{ color: item.color ?? "#ffffff" }}
                  >
                    {item.name}
                  </h3>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-kimberly mb-2">{item.description}</p>
              )}
              <p className="text-sm text-steel-gray">
                {item.count} accomplishment{item.count !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditItemDialog
          kind={kind}
          item={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteItemDialog
          kind={kind}
          item={deleting}
          others={items.filter((i) => i.id !== deleting.id)}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}

function EditItemDialog({
  kind,
  item,
  onClose,
}: {
  kind: "category" | "tag";
  item: ManagedItem;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description ?? "");
  const [color, setColor] = useState(item.color ?? PALETTE[0]);
  const [error, setError] = useState<string | null>(null);

  const label = kind === "category" ? "Category" : "Tag";
  const update = kind === "category" ? updateCategory : updateTag;

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await update({
        id: item.id,
        name: name.trim(),
        description: description.trim() || null,
        color,
      });
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error ?? "Failed to save");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Edit {label}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-900" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteItemDialog({
  kind,
  item,
  others,
  onClose,
}: {
  kind: "category" | "tag";
  item: ManagedItem;
  others: ManagedItem[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [targetId, setTargetId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const label = kind === "category" ? "category" : "tag";
  const remove = kind === "category" ? deleteCategory : deleteTag;
  const merge = kind === "category" ? mergeCategory : mergeTag;

  // A category still in use cannot be deleted outright — a merge target is required.
  const mustMerge = kind === "category" && item.count > 0;

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result = targetId
        ? await merge({ sourceId: item.id, targetId })
        : await remove(item.id);
      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error ?? "Operation failed");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Delete {label}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <p className="text-gray-600">
            {item.count > 0 ? (
              <>
                <strong>{item.name}</strong> is used by {item.count}{" "}
                accomplishment{item.count !== 1 ? "s" : ""}.{" "}
                {mustMerge
                  ? "Choose another category to move them into before deleting."
                  : "You can move them to another tag, or delete to just remove the tag from them."}
              </>
            ) : (
              <>
                Delete <strong>{item.name}</strong>? This cannot be undone.
              </>
            )}
          </p>

          {item.count > 0 && others.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merge into {mustMerge ? "(required)" : "(optional)"}
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="">
                  {mustMerge ? "Select a target..." : `Don't merge — just delete`}
                </option>
                {others.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || (mustMerge && !targetId)}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? "Working..."
              : targetId
                ? "Merge & Delete"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
