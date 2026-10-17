"use client";

import { useEffect, useRef, useState } from "react";
import type { VantaEffect, VantaNetOptions } from "vanta/dist/vanta.net.min";

import { useReducedMotion } from "@/lib/useReducedMotion";

type NetFactory = (options: VantaNetOptions) => VantaEffect;

interface VantaBackgroundProps {
  /** Classes for the wrapper, which fills its positioned parent by default. */
  className?: string;
}

/**
 * Vanta "NET": drifting connected nodes, a citation graph seen through the
 * hero lens.
 *
 * three.js (~150 KB gzip) and Vanta are imported after hydration so they never
 * block first paint; on a first visit they load behind the intro curtain. A
 * static dot grid shows until the canvas is ready, and stays for
 * reduced-motion users or browsers without WebGL.
 */
export default function VantaBackground({ className = "absolute inset-0" }: VantaBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    let effect: VantaEffect | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [THREE, vanta] = await Promise.all([
          import("three"),
          import("vanta/dist/vanta.net.min"),
        ]);
        if (cancelled || !ref.current) return;

        // The UMD bundle may surface as `default` or `default.default`
        // depending on the bundler's CJS interop.
        const mod = vanta as unknown as { default: NetFactory | { default: NetFactory } };
        const NET = typeof mod.default === "function" ? mod.default : mod.default.default;

        const small = ref.current.clientWidth < 360;
        effect = NET({
          el: ref.current,
          THREE,
          mouseControls: true,
          touchControls: false,
          gyroControls: false,
          minHeight: 120,
          minWidth: 120,
          scale: 1,
          scaleMobile: 1,
          color: 0x8b3a2a,
          backgroundColor: 0xfbf8f2,
          points: small ? 7 : 10,
          maxDistance: small ? 17 : 20,
          spacing: small ? 14 : 16,
          showDots: true,
        });
        setReady(true);
      } catch (error) {
        // No WebGL, blocked script, etc. The dot grid stays.
        console.warn("[vanta] background disabled:", error);
      }
    })();

    return () => {
      cancelled = true;
      effect?.destroy();
      setReady(false);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden="true" className={`dot-grid pointer-events-none overflow-hidden ${className}`}>
      <div
        ref={ref}
        className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-75" : "opacity-0"}`}
      />
    </div>
  );
}
