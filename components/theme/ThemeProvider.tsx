"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
type Theme = "dark" | "light" | "system";
const ThemeContext = createContext<any>(undefined);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [resolved, setResolved] = useState("dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); const s = localStorage.getItem("hive-theme") as Theme; if (s) setTheme(s); }, []);
  useEffect(() => {
    if (!mounted) return;
    const r = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
    setResolved(r);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(r);
    localStorage.setItem("hive-theme", theme);
  }, [theme, mounted]);
  const toggle = () => setTheme(p => p === "dark" ? "light" : p === "light" ? "system" : "dark");
  if (!mounted) return <>{children}</>;
  return <ThemeContext.Provider value={{ theme, resolved, toggle }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }