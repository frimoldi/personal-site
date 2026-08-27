"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("site-theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className="themeToggle"
      onClick={toggle}
      aria-label="Toggle color theme"
      suppressHydrationWarning
    >
      {theme === "dark" ? "light" : "night"}
    </button>
  );
}
