/**
 * Shared class strings for dialog chrome and form fields.
 *
 * Five dialogs and two forms repeat the same header/body/footer/field markup.
 * Keeping the classes in one place is what stops them drifting apart again —
 * they were still carrying light-theme greys (`bg-white`, `text-gray-700`) long
 * after the rest of the app moved to the dark palette.
 *
 * Surfaces stack darkest-to-lightest by depth: blurred black overlay → panel on
 * `ebony-clay` (the app's card surface) → fields recessed onto `steel-gray`.
 */

export const dialogOverlay =
  "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in animation-duration-150";

/** Pair with a `max-w-*` at the call site. */
export const dialogPanel =
  "w-full rounded-lg border border-kimberly bg-ebony-clay shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 animation-duration-200";

export const dialogHeader =
  "flex items-center justify-between border-b border-kimberly px-6 py-4";

export const dialogTitle = "text-lg font-semibold text-mischka";

export const dialogClose =
  "rounded-md p-1 text-kimberly transition-colors hover:bg-east-bay hover:text-mischka hover:cursor-pointer";

export const dialogBody = "space-y-4 px-6 py-4";

export const dialogText = "text-sm text-mischka/70";

export const dialogFooter =
  "flex justify-end gap-3 rounded-b-lg border-t border-kimberly bg-steel-gray/40 px-6 py-4";

export const fieldLabel = "mb-1 block text-sm font-medium text-mischka";

export const fieldInput =
  "w-full rounded-md border border-kimberly bg-steel-gray px-3 py-2 text-mischka placeholder-kimberly transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500";

/** Native arrow is hidden; call sites overlay their own <ChevronDown />. */
export const fieldSelect = `${fieldInput} cursor-pointer appearance-none`;

export const btnGhost =
  "rounded-md border border-kimberly px-4 py-2 font-medium text-mischka transition-colors hover:bg-east-bay hover:cursor-pointer";

export const btnPrimary =
  "rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer";

export const btnDanger =
  "rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer";
