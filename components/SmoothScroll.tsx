"use client";

import { ReactLenis } from "lenis/react";

import { useIntroDone } from "@/lib/useIntroDone";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Lenis smooth scrolling on the root scroller. It starts after the intro (the
 * page is scroll-locked while the curtain is down) and is skipped entirely for
 * anyone who prefers reduced motion.
 */
export default function SmoothScroll() {
  const reducedMotion = useReducedMotion();
  const introDone = useIntroDone();
  if (reducedMotion || !introDone) return null;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        anchors: true,
      }}
    />
  );
}
