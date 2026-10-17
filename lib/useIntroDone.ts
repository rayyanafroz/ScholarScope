"use client";

import { useSyncExternalStore } from "react";

import { INTRO_DONE_EVENT } from "@/lib/motion";

function subscribe(onChange: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, onChange);
  return () => window.removeEventListener(INTRO_DONE_EVENT, onChange);
}

/**
 * True once the intro overlay is gone (or never played). Animations that
 * should be seen, like the hero headline, wait for this.
 */
export function useIntroDone(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.intro !== "play" && document.documentElement.dataset.intro !== "leaving",
    () => false,
  );
}
