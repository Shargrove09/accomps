"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  btnDanger,
  btnGhost,
  btnPrimary,
  dialogBody,
  dialogClose,
  dialogFooter,
  dialogHeader,
  dialogOverlay,
  dialogPanel,
  dialogText,
  dialogTitle,
  fieldInput,
  fieldLabel,
} from "@/lib/ui";
import {
  updateCategory,
  deleteCategory,
  mergeCategory,
  updateTag,
  deleteTag,
  mergeTag,
  deleteTags,
  mergeTags,
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState<"delete" | "merge" | null>(null);

  const label = kind === "category" ? "Category" : "Tag";

  // Bulk actions are tag-only: Category is onDelete: Restrict, so a bulk delete
  // would throw on the first category in use and roll back the whole batch.
  const bulkEnabled = kind === "tag";

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const selectedItems = items.filter((i) => selected.has(i.id));

  return (
    <>
      {bulkEnabled && (
        <BulkActionBar
          items={items}
          selected={selected}
          setSelected={setSelected}
          onDelete={() => setBulkMode("delete")}
          onMerge={() => setBulkMode("merge")}
        />
      )}

      {items.length === 0 ? (
        <p className="text-center text-kimberly">
          No {label.toLowerCase()}s yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-ebony-clay rounded-lg shadow-sm border p-6 text-center transition-colors group relative ${
                selected.has(item.id)
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-kimberly hover:border-blue-600"
              }`}
            >
              {bulkEnabled && (
                // Always visible, unlike the hover-revealed actions — otherwise
                // there's no way to discover that bulk selection exists.
                <label className="absolute top-2 left-2 flex items-center cursor-pointer p-1.5">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => toggle(item.id)}
                    aria-label={`Select ${item.name}`}
                    className="h-4 w-4 rounded border-kimberly bg-east-bay text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              )}

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

      {bulkMode && selectedItems.length > 0 && (
        <BulkActionDialog
          mode={bulkMode}
          items={selectedItems}
          targets={items.filter((i) => !selected.has(i.id))}
          onClose={() => setBulkMode(null)}
          onDone={() => {
            setBulkMode(null);
            setSelected(new Set());
          }}
        />
      )}
    </>
  );
}

function BulkActionBar({
  items,
  selected,
  setSelected,
  onDelete,
  onMerge,
}: {
  items: ManagedItem[];
  selected: Set<string>;
  setSelected: (s: Set<string>) => void;
  onDelete: () => void;
  onMerge: () => void;
}) {
  const count = selected.size;
  // Shortcuts for the two shapes that actually need bulk treatment: one-off
  // noise, and tags nothing points at.
  const usedOnce = items.filter((i) => i.count === 1);
  const unused = items.filter((i) => i.count === 0);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-kimberly bg-ebony-clay px-4 py-3">
      <span className="text-sm text-mischka">
        {count > 0 ? (
          <>
            <strong>{count}</strong> tag{count !== 1 ? "s" : ""} selected
          </>
        ) : (
          "Select tags to delete or merge them in bulk"
        )}
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {unused.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected(new Set(unused.map((i) => i.id)))}
            className="px-3 py-1.5 text-sm rounded-md border border-kimberly text-mischka hover:bg-east-bay transition-colors hover:cursor-pointer"
          >
            Select unused ({unused.length})
          </button>
        )}
        {usedOnce.length > 0 && (
          <button
            type="button"
            onClick={() => setSelected(new Set(usedOnce.map((i) => i.id)))}
            className="px-3 py-1.5 text-sm rounded-md border border-kimberly text-mischka hover:bg-east-bay transition-colors hover:cursor-pointer"
          >
            Select used once ({usedOnce.length})
          </button>
        )}
        {count > 0 && (
          <>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 text-sm rounded-md border border-kimberly text-mischka hover:bg-east-bay transition-colors hover:cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onMerge}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors hover:cursor-pointer"
            >
              Merge into...
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-3 py-1.5 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors hover:cursor-pointer"
            >
              Delete selected
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function BulkActionDialog({
  mode,
  items,
  targets,
  onClose,
  onDone,
}: {
  mode: "delete" | "merge";
  items: ManagedItem[];
  /** Candidate merge survivors — the unselected tags. */
  targets: ManagedItem[];
  onClose: () => void;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [targetId, setTargetId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ids = items.map((i) => i.id);
  const linkCount = items.reduce((sum, i) => sum + i.count, 0);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const result =
        mode === "merge"
          ? await mergeTags({ sourceIds: ids, targetId })
          : await deleteTags(ids);
      if (result.success) {
        router.refresh();
        onDone();
      } else {
        setError(result.error ?? "Operation failed");
      }
    });
  };

  return (
    <div className={dialogOverlay}>
      <div className={cn(dialogPanel, "max-w-md")}>
        <div className={dialogHeader}>
          <h3 className={dialogTitle}>
            {mode === "merge" ? "Merge" : "Delete"} {items.length} tag
            {items.length !== 1 ? "s" : ""}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={dialogClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={dialogBody}>
          <div className="max-h-32 overflow-y-auto scroll-slim rounded border border-kimberly bg-steel-gray px-3 py-2">
            <p className="text-sm text-mischka">
              {items.map((i) => i.name).join(", ")}
            </p>
          </div>

          {mode === "merge" ? (
            <>
              <div>
                <label className={fieldLabel}>Merge into (required)</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className={fieldInput}
                >
                  <option value="">Select a target...</option>
                  {targets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.count})
                    </option>
                  ))}
                </select>
              </div>
              {/* No summed total here on purpose: an accomplishment carrying
                  several of the selected tags collapses to a single link, so
                  adding up the counts would overstate the result. */}
              <p className={dialogText}>
                The target will be applied to every accomplishment that had any
                of these tags; duplicates collapse. The {items.length} merged tag
                {items.length !== 1 ? "s" : ""} will then be deleted.
              </p>
            </>
          ) : (
            <p className={dialogText}>
              {linkCount > 0 ? (
                <>
                  These tags will be removed from the accomplishments carrying
                  them ({linkCount} link{linkCount !== 1 ? "s" : ""} in total).
                  The accomplishments themselves are not deleted.
                </>
              ) : (
                <>None of these tags are in use.</>
              )}{" "}
              This cannot be undone.
            </p>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className={dialogFooter}>
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || (mode === "merge" && !targetId)}
            className={mode === "merge" ? btnPrimary : btnDanger}
          >
            {isPending
              ? "Working..."
              : mode === "merge"
                ? "Merge & Delete"
                : "Delete"}
          </button>
        </div>
      </div>
    </div>
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
    <div className={dialogOverlay}>
      <div className={cn(dialogPanel, "max-w-md")}>
        <div className={dialogHeader}>
          <h3 className={dialogTitle}>Edit {label}</h3>
          <button
            type="button"
            onClick={onClose}
            className={dialogClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={dialogBody}>
          <div>
            <label className={fieldLabel}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldInput}
              autoFocus
            />
          </div>

          <div>
            <label className={fieldLabel}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={cn(fieldInput, "resize-none")}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className={cn(fieldLabel, "mb-2")}>Color</label>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform hover:scale-110 hover:cursor-pointer",
                    // Offset ring matches the panel, so the halo reads as a gap.
                    color === c &&
                      "ring-2 ring-mischka ring-offset-2 ring-offset-ebony-clay"
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className={dialogFooter}>
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className={btnPrimary}
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
    <div className={dialogOverlay}>
      <div className={cn(dialogPanel, "max-w-md")}>
        <div className={dialogHeader}>
          <h3 className={dialogTitle}>Delete {label}</h3>
          <button
            type="button"
            onClick={onClose}
            className={dialogClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className={dialogBody}>
          <p className={dialogText}>
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
              <label className={fieldLabel}>
                Merge into {mustMerge ? "(required)" : "(optional)"}
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className={fieldInput}
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

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className={dialogFooter}>
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || (mustMerge && !targetId)}
            className={btnDanger}
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
