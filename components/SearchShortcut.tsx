"use client";

import { useEffect } from "react";

/** Press "/" anywhere to focus the search box. The hint shows on desktop only. */
export default function SearchShortcut() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const input = document.getElementById("q");
      if (input instanceof HTMLInputElement) {
        event.preventDefault();
        input.focus();
        input.select();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <kbd
      aria-hidden="true"
      className="mr-2 hidden rounded border border-line px-1.5 py-0.5 font-sans text-xs text-muted group-focus-within:hidden md:inline-block"
    >
      /
    </kbd>
  );
}
