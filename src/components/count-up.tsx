"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useLayoutEffect is a no-op on the server and React warns about it there, so
// fall back to useEffect during SSR. The layout effect matters on the client:
// it re-renders at 0 before the browser paints, so the final value never
// flashes on screen before the ramp starts.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Counts from 0 up to `value` on mount.
 *
 * The initial render is the final value so the server-rendered markup matches
 * hydration and the number is still correct with JS off.
 */
export function CountUp({
  value,
  durationMs = 800,
  className,
}: {
  value: number;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    if (
      value === 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    setDisplay(0);

    let start: number | null = null;
    const step = (now: number) => {
      start ??= now;
      const t = Math.min((now - start) / durationMs, 1);
      // easeOutCubic — quick off the mark, settles gently on the real number.
      setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  // Hidden from assistive tech — the mid-ramp numbers are noise. Callers put
  // the real value in the surrounding element's accessible name.
  return (
    <span className={className} aria-hidden="true">
      {display}
    </span>
  );
}
