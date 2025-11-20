"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  addAccomplishment,
  getCategories,
  getExistingTags,
} from "@/lib/actions";
import { Plus, ChevronDown, X } from "lucide-react";
import { Button } from "./ui/button";

type Category = {
  id: string;
  name: string;
  color: string;
};

type Tag = {
  id: string;
  name: string;
  color: string;
};

export function AddAccomplishmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // New state for category management
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // New state for tag management
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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
      const newTag: Tag = {
        id: `custom-${Date.now()}`, // Temporary ID for new tags
        name: customTagInput.trim(),
        color: "#6B7280",
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
      // Convert selected tags to tag names for the API
      const tagNames = selectedTags.map((tag) => tag.name);

      await addAccomplishment({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
        tags: tagNames,
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
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What did you accomplish?"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category *
          </label>

          {!isCreatingNewCategory && categories.length > 0 ? (
            <div className="relative">
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-ebony-clay"
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new category name"
                required
              />
              {categories.length > 0 && (
                <Button
                  type="button"
                  onClick={() => {
                    setIsCreatingNewCategory(false);
                    setCategory("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  ← Back to existing categories
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us more about this accomplishment..."
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags
        </label>

        <div className="space-y-3">
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm"
                  style={{
                    backgroundColor: tag.color + "20",
                    color: tag.color,
                  }}
                >
                  {tag.name}
                  <Button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-ebony-clay"
                  >
                    <option value="">Select a tag to add...</option>
                    {availableTags
                      .filter(
                        (tag) =>
                          !selectedTags.find(
                            (selected) => selected.id === tag.id
                          )
                      )
                      .map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                    <option value="create-new">+ Create New Tag</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              )}

              {availableTags.length === 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomTag(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-500 hover:bg-gray-50"
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomTagAdd();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new tag name"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCustomTagAdd}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCustomTag(false);
                  setCustomTagInput("");
                }}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
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
          className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isPending ? "Adding..." : "Add Accomplishment"}
        </Button>
      </div>
    </form>
  );
}
