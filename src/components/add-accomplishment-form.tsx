"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  addAccomplishment,
  getCategories,
  getExistingTags,
  generateDescription,
} from "@/lib/actions";
import { Plus, ChevronDown, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import type { CategoryOption, FormTag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { fieldInput, fieldLabel, fieldSelect } from "@/lib/ui";

export function AddAccomplishmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // New state for category management
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // New state for tag management
  const [availableTags, setAvailableTags] = useState<FormTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<FormTag[]>([]);
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");

  // Fetch categories and tags on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load categories
      const fetchedCategories = await getCategories();
      const filteredCategories = fetchedCategories.map((cat) => ({
        ...cat,
        color: cat.color || "#6B7280", // Default color if null
      }));
      setCategories(filteredCategories);

      // Load tags
      const fetchedTags = await getExistingTags();
      const filteredTags = fetchedTags.map((tag) => ({
        ...tag,
        color: tag.color || "#6B7280", // Default color if null
      }));
      setAvailableTags(filteredTags);
    };
    loadData();
  }, []);

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
        id: `custom-${Date.now()}`, // Temporary ID for new tags
        name: customTagInput.trim(),
        color: "#6B7280",
      };
      setSelectedTags([...selectedTags, newTag]);
      setCustomTagInput("");
      setIsAddingCustomTag(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!title.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateDescription({
        title: title.trim(),
        category: category.trim() || undefined,
        tags: selectedTags.map((tag) => tag.name),
      });
      if (result.description) {
        setDescription(result.description);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim()) return;

    startTransition(async () => {
      // Convert selected tags to tag names for the API
      const tagNames = selectedTags.map((tag) => tag.name);

      // If the user left the description blank, auto-generate a short one.
      let finalDescription = description.trim();
      if (!finalDescription) {
        const generated = await generateDescription({
          title: title.trim(),
          category: category.trim() || undefined,
          tags: tagNames,
        });
        finalDescription = generated.description;
      }

      await addAccomplishment({
        title: title.trim(),
        description: finalDescription || undefined,
        category: category.trim(),
        tags: tagNames,
        // The form's "+ Create New Category" option is a deliberate human
        // choice, so this path opts in. The agent API does not.
        allowNewCategory: true,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setSelectedCategoryId("");
      setIsCreatingNewCategory(false);
      setSelectedTags([]);
      setIsAddingCustomTag(false);
      setCustomTagInput("");

      // Refresh categories and tags list
      const fetchedCategories = await getCategories();
      const transformedCategories = fetchedCategories.map((cat) => ({
        ...cat,
        color: cat.color || "#6B7280", // Default color if null
      }));
      setCategories(transformedCategories);

      const fetchedTags = await getExistingTags();
      const transformedTags = fetchedTags.map((tag) => ({
        ...tag,
        color: tag.color || "#6B7280", // Default color if null
      }));
      setAvailableTags(transformedTags);

      // Refresh the page to update the accomplishments list
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

          {!isCreatingNewCategory && categories.length > 0 ? (
            <div className="relative">
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={fieldSelect}
                required
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="create-new">+ Create New Category</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kimberly" />
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldInput}
                placeholder="Enter new category name"
                required
              />
              {categories.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreatingNewCategory(false);
                    setCategory("");
                  }}
                  className="px-0 text-sm text-blue-400 hover:bg-transparent hover:text-blue-300"
                >
                  ← Back to existing categories
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="description" className={cn(fieldLabel, "mb-0")}>
            Description
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={!title.trim() || isGenerating}
            className={cn(
              "inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed",
              isGenerating && "animate-pulse"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={fieldInput}
          placeholder="Tell us more about this accomplishment..."
        />
      </div>

      <div>
        <label htmlFor="tags" className={fieldLabel}>
          Tags
        </label>

        <div className="space-y-3">
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-medium"
                  style={{
                    backgroundColor: tag.color + "26",
                    borderColor: tag.color + "59",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                  {/* Plain button, not <Button>: that carries a `bg-primary`
                      pill that would sit inside the tag chip. */}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    aria-label={`Remove ${tag.name}`}
                    className="ml-1 rounded-full p-0.5 opacity-70 transition-opacity hover:bg-white/20 hover:opacity-100 hover:cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag selection interface */}
          {!isAddingCustomTag ? (
            <div className="space-y-2">
              {availableTags.length > 0 && (
                <div className="relative">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value === "create-new") {
                        setIsAddingCustomTag(true);
                      } else if (e.target.value) {
                        handleTagSelect(e.target.value);
                      }
                    }}
                    className={fieldSelect}
                  >
                    <option value="">Select a tag to add...</option>
                    {availableTags
                      .filter(
                        (tag) =>
                          !selectedTags.find(
                            (selected) => selected.id === tag.id,
                          ),
                      )
                      .map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    <option value="create-new">+ Create New Tag</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-kimberly" />
                </div>
              )}

              {availableTags.length === 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomTag(true)}
                  className="w-full rounded-md border border-dashed border-kimberly bg-steel-gray px-3 py-2 text-left text-kimberly transition-colors hover:border-blue-500/70 hover:text-mischka hover:cursor-pointer"
                >
                  + Add your first tag
                </button>
              )}
            </div>
          ) : (
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
                placeholder="Enter new tag name"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCustomTagAdd}
                className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white transition-colors hover:bg-blue-700 hover:cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCustomTag(false);
                  setCustomTagInput("");
                }}
                className="rounded-md border border-kimberly px-3 py-2 text-mischka transition-colors hover:bg-east-bay hover:cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !title.trim() || !category.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-ebony-clay disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding..." : "Add Accomplishment"}
        </Button>
      </div>
    </form>
  );
}
