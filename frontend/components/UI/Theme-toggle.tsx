"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Use saved theme, or system preference, or default to light
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Save theme to localStorage and apply
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        p-2 rounded-lg
        text-text-secondary
        cursor-pointer
        hover:bg-black/10 dark:hover:bg-white/10
        hover:text-text-primary
        transition-all duration-200
        hover:scale-110 active:scale-95
      "
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}