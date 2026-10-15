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
  "rounded-md p-1 text-kimberly transition-colors hover:bg-east-bay hover:text-mischka hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export const dialogBody = "space-y-4 px-6 py-4";

export const dialogText = "text-sm text-mischka/70";

export const dialogFooter =
  "flex justify-end gap-3 rounded-b-lg border-t border-kimberly bg-steel-gray/40 px-6 py-4";

export const fieldLabel = "mb-1 block text-sm font-medium text-mischka";

export const fieldInput =
  "w-full rounded-md border border-kimberly bg-steel-gray px-3 py-2 text-mischka placeholder-kimberly transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500";


export const btnGhost =
  "rounded-md border border-kimberly px-4 py-2 font-medium text-mischka transition-colors hover:bg-east-bay hover:cursor-pointer";

export const btnPrimary =
  "rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer";

export const btnDanger =
  "rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer";

/** Keyboard-only ring. Pair with a matching `ring-offset-*` on non-card surfaces. */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ebony-clay";

/** `dialogClose` for surfaces that are already east-bay (the nav drawer). */
export const drawerClose =
  "rounded-md p-1 text-kimberly transition-colors hover:bg-ebony-clay hover:text-mischka hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-east-bay";

/** Neutral chip: color lives in a ColorDot inside it, never in the chip itself. */
export const chipBase =
  `inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm transition-colors hover:cursor-pointer ${focusRing}`;

/** Soft fill plus a 1px top highlight: raised, with no hue involved. */
export const chipSurface =
  "border-kimberly/40 bg-east-bay/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]";

export const chipIdle = `${chipSurface} text-mischka/85 hover:border-kimberly hover:bg-east-bay/50 hover:text-mischka`;

const CHIP_FALLBACK = "#6B7280";
const INK_DARK = "#1e1e2f"; /* steel-gray */

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Whichever of dark/white ink has higher contrast on `color` (white fails on amber/lime). */
export function inkOn(color: string | null | undefined) {
  const c = /^#[0-9a-f]{6}$/i.test(color ?? "") ? color! : CHIP_FALLBACK;
  const l = luminance(c);
  return (l + 0.05) / (luminance(INK_DARK) + 0.05) >= 1.05 / (l + 0.05)
    ? INK_DARK
    : "#fff";
}

/** A selected chip fills with its own stored color: color answers the click. */
export function chipOnStyle(color: string | null | undefined) {
  const c = /^#[0-9a-f]{6}$/i.test(color ?? "") ? color! : CHIP_FALLBACK;
  return { backgroundColor: c, borderColor: c, color: inkOn(c) };
}
