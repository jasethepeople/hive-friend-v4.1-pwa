"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const icons: any = { dark: <Moon className="w-4 h-4" />, light: <Sun className="w-4 h-4" />, system: <Monitor className="w-4 h-4" /> };
  return (
    <button onClick={toggle} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900/50 hover:border-hive-accent hover:text-hive-accent transition-all text-xs">
      {icons[theme]}<span className="hidden sm:inline">{theme}</span>
    </button>
  );
}