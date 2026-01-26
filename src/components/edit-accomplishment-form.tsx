"use client";

import { useState, useTransition, useEffect } from "react";
import {
  updateAccomplishment,
  getCategories,
  getExistingTags,
} from "@/lib/actions";
import { X, ChevronDown } from "lucide-react";

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

export function EditAccomplishmentForm({
  accomplishment,
  onClose,
  onSuccess,
}: {
  accomplishment: Accomplishment;
  onClose: () => void;
  onSuccess?: (updatedAccomplishment: Accomplishment) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(accomplishment.title);
  const [description, setDescription] = useState(
    accomplishment.description || "",
  );
  const [category, setCategory] = useState(accomplishment.category.name);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    accomplishment.category.id,
  );

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    accomplishment.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      color: t.tag.color || "#6B7280",
    })),
  );
  const [isAddingCustomTag, setIsAddingCustomTag] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const fetchedCategories = await getCategories();
      const filteredCategories = fetchedCategories.map((cat) => ({
        ...cat,
        color: cat.color || "#6B7280",
      }));
      setCategories(filteredCategories);

      const fetchedTags = await getExistingTags();
      const filteredTags = fetchedTags.map((tag) => ({
        ...tag,
        color: tag.color || "#6B7280",
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
        id: `custom-${Date.now()}`,
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
      const tagNames = selectedTags.map((tag) => tag.name);

      const result = await updateAccomplishment({
        id: accomplishment.id,
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
        tags: tagNames,
      });

      if (result.success && result.data) {
        onSuccess?.(result.data);
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-mischka rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-east-bay border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Accomplishment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                className="w-full px-3 py-2 border border-ebony-clay rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
              {isCreatingNewCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-ebony-clay rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-ebony-clay rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="create-new">+ Create New Category</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
              className="w-full px-3 py-2 border border-ebony-clay rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              placeholder="Add more details (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag.id)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3 cursor-pointer" />
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter custom tag name"
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
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value === "add-custom") {
                      setIsAddingCustomTag(true);
                    } else if (e.target.value) {
                      handleTagSelect(e.target.value);
                    }
                    e.target.value = "";
                  }}
                  className="w-full px-3 py-2 border border-ebony-clay rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-gray-700"
                >
                  <option value="">Add a tag...</option>
                  {availableTags
                    .filter((tag) => !selectedTags.find((t) => t.id === tag.id))
                    .map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  <option value="add-custom">+ Add Custom Tag</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending || !title.trim() || !category.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium hover:cursor-pointer"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
