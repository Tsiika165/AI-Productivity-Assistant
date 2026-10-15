
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Change colour theme"
        className="theme-toggle"
      >
        <span className="theme-toggle-icon">◐</span>
        <span>Appearance</span>
      </button>
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
      title={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {dark ? "☀" : "☾"}
      </span>
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
