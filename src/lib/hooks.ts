import { useState, useEffect } from "react";

/**
 * Debounces a value by delaying its update until after the specified delay.
 * Useful for search inputs to reduce the number of filter operations.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const [searchText, setSearchText] = useState("");
 * const debouncedSearch = useDebounce(searchText, 300);
 * // debouncedSearch will only update 300ms after the user stops typing
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    // or if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
