import {
  Accomplishment,
  Category,
  Tag,
  AccomplishmentTag,
} from "@/generated/prisma/client";

// ── Prisma-derived composite types ──────────────────────────────────────────

export type AccomplishmentWithDetails = Accomplishment & {
  category: Category;
  tags: (AccomplishmentTag & {
    tag: Tag;
  })[];
};

// ── Lightweight UI types (used in client components) ────────────────────────

/** Minimal category shape used by forms and lists. */
export type CategoryOption = {
  id: string;
  name: string;
  color: string | null;
};

/** Minimal tag shape used by forms and lists. */
export type TagOption = {
  id: string;
  name: string;
  color: string | null;
};

/** Accomplishment shape as passed to client components (serialisable). */
export type AccomplishmentItem = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  category: CategoryOption;
  tags: {
    tag: TagOption;
  }[];
};

// ── Domain / analytics types ────────────────────────────────────────────────

export type TimeScale = "daily" | "weekly" | "monthly" | "yearly";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "category";

export type FilterOptions = {
  categories?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
};

export type ParsedAccomplishment = {
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  confidence?: number;
  status?: string;
  reasoning?: string;
  raw_input?: string;
  source?: string;
};
