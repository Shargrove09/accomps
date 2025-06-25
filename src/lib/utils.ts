import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getDateRange(scale: "daily" | "weekly" | "monthly" | "yearly") {
  const now = new Date();
  const start = new Date();

  switch (scale) {
    case "daily":
      start.setDate(now.getDate() - 7); // Last 7 days
      break;
    case "weekly":
      start.setDate(now.getDate() - 30); // Last 30 days
      break;
    case "monthly":
      start.setMonth(now.getMonth() - 6); // Last 6 months
      break;
    case "yearly":
      start.setFullYear(now.getFullYear() - 2); // Last 2 years
      break;
  }

  return { start, end: now };
}
