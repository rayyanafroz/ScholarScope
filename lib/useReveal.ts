"use client";

import { useEffect, type RefObject } from "react";

import { getMotionMode } from "@/lib/motion";

/**
 * Staggers `[data-reveal]` children in with GSAP when GSAP mode is on.
 * In CSS mode this is a no-op: globals.css animates new elements itself.
 *
 * GSAP is imported dynamically, so it is only downloaded when enabled.
 * Elements are marked `data-revealed` so re-renders (e.g. changing the year
 * filter) only animate cards that are new to the list.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>, trigger: unknown) {
  useEffect(() => {
    if (getMotionMode() !== "gsap") return;
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );
    if (targets.length === 0) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import("gsap")
      .then(({ gsap }) => {
        if (cancelled) return;
        targets.forEach((el) => {
          el.dataset.revealed = "";
        });
        gsap.fromTo(
          targets,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.04,
            clearProps: "transform",
          },
        );
        cleanup = () => {
          gsap.killTweensOf(targets);
          gsap.set(targets, { opacity: 1, clearProps: "transform" });
        };
      })
      .catch(() => {
        // GSAP failed to load: fall back to the CSS animation path.
        document.documentElement.dataset.motion = "css";
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [rootRef, trigger]);
}
