import {
  Accomplishment,
  Category,
  Tag,
  AccomplishmentTag,
} from "@prisma/client";

export type AccomplishmentWithDetails = Accomplishment & {
  category: Category;
  tags: (AccomplishmentTag & {
    tag: Tag;
  })[];
};

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
