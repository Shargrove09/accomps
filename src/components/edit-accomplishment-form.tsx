"use client";

import { useState, useTransition, useMemo } from "react";
import { updateAccomplishment } from "@/lib/actions";
import { X } from "lucide-react";
import type {
  AccomplishmentItem,
  CategoryOption,
  FormTag,
  TagOption,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { ColorDot } from "@/components/color-dot";
import { Select } from "@/components/select";
import {
  btnGhost,
  btnPrimary,
  chipSurface,
  dialogClose,
  dialogOverlay,
  dialogPanel,
  dialogTitle,
  fieldInput,
  fieldLabel,
} from "@/lib/ui";

/** Convert a Date to the `YYYY-MM-DDTHH:mm` value a datetime-local input expects (local time). */
function toDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Fallback for categories and tags stored without a colour. */
const DEFAULT_COLOR = "#6B7280";

export function EditAccomplishmentForm({
  accomplishment,
  categories: categoryOptions,
  tags: tagOptions,
  onClose,
  onSuccess,
}: {
  accomplishment: AccomplishmentItem;
  categories: CategoryOption[];
  tags: TagOption[];
  onClose: () => void;
  onSuccess?: (updatedAccomplishment: AccomplishmentItem) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(accomplishment.title);
  const [description, setDescription] = useState(
    accomplishment.description || "",
  );
  const [category, setCategory] = useState(accomplishment.category.name);
  const [date, setDate] = useState(toDateTimeLocal(accomplishment.date));

  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    accomplishment.category.id,
  );

  const [selectedTags, setSelectedTags] = useState<FormTag[]>(
    accomplishment.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color || DEFAULT_COLOR,
    })),
  );
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");

  // Derived from props rather than fetched on mount — this dialog opens over an
  // already-loaded list, so its dropdowns should be usable immediately.
  const categories = useMemo(
    () =>
      categoryOptions.map((cat) => ({
        ...cat,
        color: cat.color || DEFAULT_COLOR,
      })),
    [categoryOptions],
  );

  const availableTags = useMemo<FormTag[]>(
    () =>
      tagOptions.map((tag) => ({ ...tag, color: tag.color || DEFAULT_COLOR })),
    [tagOptions],
  );

  const handleCategoryChange = (value: string) => {
    if (value === "create-new") {
      setIsCreatingNewCategory(true);
      setSelectedCategoryId("");
      setCategory("");
    } else {
      setIsCreatingNewCategory(false);
      setSelectedCategoryId(value);
      const selectedCategory = categories.find((cat) => cat.id === value);
      setCategory(selectedCategory?.name || "");
    }
  };

  const handleTagSelect = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    if (tag && !selectedTags.find((t) => t.id === tagId)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleCustomTagAdd = () => {
    if (customTagInput.trim()) {
      const newTag: FormTag = {
        id: `custom-${Date.now()}`,
        name: customTagInput.trim(),
        color: DEFAULT_COLOR,
      };
      setSelectedTags([...selectedTags, newTag]);
      setCustomTagInput("");
      setIsAddingCustomTag(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim()) return;

    startTransition(async () => {
      const tagNames = selectedTags.map((tag) => tag.name);

      const result = await updateAccomplishment({
        id: accomplishment.id,
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
        tags: tagNames,
        ...(date && { date: new Date(date) }),
        // Deliberate human choice in the UI — see add-accomplishment-form.
        allowNewCategory: true,
      });

      if (result.success && result.data) {
        onSuccess?.(result.data);
        onClose();
      }
    });
  };

  return (
    <div className={dialogOverlay}>
      <div
        className={cn(
          dialogPanel,
          "max-w-2xl max-h-[90vh] overflow-y-auto scroll-slim"
        )}
      >
        {/* Sticky over a scrolling body, so it needs its own opaque fill. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-kimberly bg-ebony-clay px-6 py-4">
          <h2 className={cn(dialogTitle, "text-xl")}>Edit Accomplishment</h2>
          <button
            type="button"
            onClick={onClose}
            className={dialogClose}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={fieldLabel}>
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={fieldInput}
                placeholder="What did you accomplish?"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className={fieldLabel}>
                Category *
              </label>
              {isCreatingNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={cn(fieldInput, "flex-1")}
                    placeholder="New category name"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingNewCategory(false);
                      setCategory(accomplishment.category.name);
                      setSelectedCategoryId(accomplishment.category.id);
                    }}
                    className="px-3 py-2 text-kimberly transition-colors hover:text-mischka hover:cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Select
                  id="category"
                  required
                  value={selectedCategoryId}
                  onChange={handleCategoryChange}
                  placeholder="Select a category…"
                  options={categories.map((c) => ({ value: c.id, label: c.name, color: c.color }))}
                  action={{ label: "Create new category", onSelect: () => handleCategoryChange("create-new") }}
                />
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className={fieldLabel}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={cn(fieldInput, "resize-none")}
              placeholder="Add more details (optional)"
            />
          </div>

          <div>
            <label htmlFor="date" className={fieldLabel}>
              Date
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldInput}
            />
          </div>

          <div>
            <label className={cn(fieldLabel, "mb-2")}>Tags</label>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`inline-flex items-center gap-2 rounded-md border py-1 pl-2.5 pr-1.5 text-sm text-mischka ${chipSurface}`}
                  >
                    <ColorDot color={tag.color} />
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      aria-label={`Remove ${tag.name}`}
                      className="rounded p-0.5 text-ink-muted transition-colors hover:bg-east-bay hover:text-mischka hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {isAddingCustomTag ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCustomTagAdd();
                    }
                  }}
                  className={cn(fieldInput, "flex-1")}
                  placeholder="Enter custom tag name"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCustomTagAdd}
                  className={cn(btnPrimary, "px-3 py-2")}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomTag(false);
                    setCustomTagInput("");
                  }}
                  className="px-3 py-2 text-kimberly transition-colors hover:text-mischka hover:cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Select
                keepOpen
                value=""
                onChange={handleTagSelect}
                placeholder="Add a tag…"
                options={availableTags
                  .filter((tag) => !selectedTags.find((t) => t.id === tag.id))
                  .map((t) => ({ value: t.id, label: t.name, color: t.color }))}
                action={{ label: "Create new tag", onSelect: () => setIsAddingCustomTag(true) }}
              />
            )}
          </div>

          <p className="text-xs text-kimberly">
            Created {new Date(accomplishment.createdAt).toLocaleString()} · Last
            edited {new Date(accomplishment.updatedAt).toLocaleString()}
          </p>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending || !title.trim() || !category.trim()}
              className={cn(
                btnPrimary,
                "flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-ebony-clay"
              )}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(btnGhost, "px-6")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
