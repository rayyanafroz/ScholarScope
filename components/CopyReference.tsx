"use client";

import { useEffect, useState } from "react";

/** Copies a ready-made reference string, with a fallback for non-HTTPS pages. */
export default function CopyReference({ reference }: { reference: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(reference);
      } else {
        // navigator.clipboard is unavailable on plain-HTTP origins (e.g. a LAN IP).
        const area = document.createElement("textarea");
        area.value = reference;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand("copy");
        area.remove();
        if (!ok) throw new Error("copy failed");
      }
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        title={reference}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          state === "copied"
            ? "border-accent bg-accent-soft text-accent-strong"
            : "border-line-strong text-ink-soft hover:border-accent hover:text-accent"
        }`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-none stroke-current">
          {state === "copied" ? (
            <path d="m3.5 8.5 3 3 6-7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <rect x="5" y="5" width="8" height="8" rx="1.5" strokeWidth="1.3" />
              <path d="M3 10.5V4.5A1.5 1.5 0 0 1 4.5 3h6" strokeWidth="1.3" strokeLinecap="round" />
            </>
          )}
        </svg>
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn’t copy" : "Copy reference"}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Reference copied to clipboard." : state === "failed" ? "Copy failed." : ""}
      </span>
    </>
  );
}
