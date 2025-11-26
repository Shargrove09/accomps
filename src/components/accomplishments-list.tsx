"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/helpers";
import { Calendar, Tag, Edit2, Trash2, Search, X } from "lucide-react";
import { EditAccomplishmentForm } from "./edit-accomplishment-form";
import { ConfirmDialog } from "./confirm-dialog";
import { deleteAccomplishment, getAccomplishment } from "@/lib/actions";
import { useDebounce } from "@/lib/hooks";

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

type Category = {
  id: string;
  name: string;
  color: string | null;
};

type Tag = {
  id: string;
  name: string;
  color: string | null;
};

export function AccomplishmentsList({
  initialAccomplishments,
  categories,
  tags,
}: {
  initialAccomplishments: Accomplishment[];
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [accomplishments, setAccomplishments] = useState(
    initialAccomplishments
  );
  const [editingAccomplishment, setEditingAccomplishment] =
    useState<Accomplishment | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchText, 300);

  // Filter logic
  const filteredAccomplishments = useMemo(() => {
    return accomplishments.filter((accomplishment) => {
      // Search filter: match title or description (case-insensitive)
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const titleMatch = accomplishment.title
          .toLowerCase()
          .includes(searchLower);
        const descriptionMatch =
          accomplishment.description?.toLowerCase().includes(searchLower) ||
          false;
        if (!titleMatch && !descriptionMatch) return false;
      }

      // Category filter: OR logic (show if category in selected array OR array empty)
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(accomplishment.category.name)) {
          return false;
        }
      }

      // Tag filter: OR logic (show if ANY tag matches OR array empty)
      if (selectedTags.length > 0) {
        const accomplishmentTagNames = accomplishment.tags.map(
          (t) => t.tag.name
        );
        const hasMatchingTag = selectedTags.some((selectedTag) =>
          accomplishmentTagNames.includes(selectedTag)
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }, [accomplishments, debouncedSearch, selectedCategories, selectedTags]);

  // Filter handlers
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const activeFilterCount =
    (debouncedSearch ? 1 : 0) + selectedCategories.length + selectedTags.length;

  const handleEdit = async (id: string) => {
    const accomplishment = await getAccomplishment(id);
    if (accomplishment) {
      setEditingAccomplishment(accomplishment);
    }
  };

  const handleEditSuccess = (updatedAccomplishment: Accomplishment) => {
    setAccomplishments((prev) =>
      prev.map((a) =>
        a.id === updatedAccomplishment.id ? updatedAccomplishment : a
      )
    );

    setEditingAccomplishment(null);

    // TODO: Not sure if we need to refresh tot ensure data consistency?
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
      {/* Filter Bar */}
      <div className="p-4 border-b border-kimberly space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kimberly" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search accomplishments..."
            className="w-full pl-10 pr-4 py-2 bg-ebony-clay border border-kimberly rounded-md text-mischka placeholder-kimberly focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div>
            <label className="text-sm font-medium text-kimberly mb-2 block">
              Categories
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.name)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? "text-white ring-2 ring-white"
                        : "text-white opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: category.color || "#6B7280" }}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tag Filter Pills */}
        {tags.length > 0 && (
          <div>
            <label className="text-sm font-medium text-kimberly mb-2 block">
              Tags
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.name)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? "text-white ring-2 ring-white"
                        : "text-white opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: tag.color || "#6B7280" }}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-kimberly">
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
              active
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-mischka bg-east-bay hover:bg-kimberly rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Accomplishments List */}
      {filteredAccomplishments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mb-4">
            <Calendar className="h-12 w-12 mx-auto text-kimberly" />
          </div>
          <h3 className="text-lg font-medium text-mischka mb-2">
            {accomplishments.length === 0
              ? "No accomplishments yet"
              : "No accomplishments match your filters"}
          </h3>
          <p className="text-kimberly">
            {accomplishments.length === 0
              ? "Start tracking your achievements by adding your first accomplishment above."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-kimberly">
          {filteredAccomplishments.map((accomplishment) => (
            <div
              key={accomplishment.id}
              className="p-6 hover:bg-east-bay transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-mischka group-hover:text-white transition-colors">
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
                    <p className="text-kimberly mb-3 leading-relaxed">
                      {accomplishment.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-kimberly">
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
                              style={{
                                backgroundColor: tag.color || "#6B7280",
                              }}
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
                    className="p-2 text-blue-400 hover:bg-ebony-clay rounded-md transition-colors hover:cursor-pointer"
                    title="Edit accomplishment"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(accomplishment.id)}
                    className="p-2 text-red-400 hover:bg-ebony-clay rounded-md transition-colors hover:cursor-pointer"
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
