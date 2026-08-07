"use client";
export function useHaptics() {
  const v = (p: number | number[] = 50) => { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(p); };
  return { light: () => v(10), medium: () => v(20), heavy: () => v([30, 50, 30]), success: () => v([10, 30, 10]), error: () => v([50, 100, 50]) };
}