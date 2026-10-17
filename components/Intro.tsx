import type { CSSProperties } from "react";

const FIRST = "Scholar";
const SECOND = "Scope";

/**
 * First-visit intro: a lens draws itself, a dot orbits it, the wordmark rises
 * letter by letter while a counter runs to 100, then the sheet lifts away.
 *
 * Pure markup + CSS (see "Intro" in globals.css). It's hidden unless the boot
 * script sets <html data-intro="play">, so it costs nothing on later visits
 * and never blocks the page: there is no JavaScript waiting behind it.
 */
export default function Intro() {
  let i = 0;
  const letters = (word: string, className = "") =>
    Array.from(word).map((ch) => (
      <span key={i} className={`intro-letter ${className}`} style={{ "--i": i++ } as CSSProperties}>
        {ch}
      </span>
    ));

  return (
    <div className="intro" aria-hidden="true">
      <svg viewBox="0 0 140 140" className="size-28 text-accent sm:size-32">
        <g className="intro-orbit">
          <ellipse
            cx="70"
            cy="70"
            rx="64"
            ry="22"
            transform="rotate(-20 70 70)"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
          />
          <g transform="rotate(-20 70 70)">
            <circle r="3.5" className="fill-accent">
              <animateMotion
                dur="2.2s"
                repeatCount="indefinite"
                path="M6,70 a64,22 0 1,0 128,0 a64,22 0 1,0 -128,0"
              />
            </circle>
          </g>
          {/* A tiny citation graph inside the lens. */}
          <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="0.75">
            <path d="M52 52 L66 46 L74 60 L60 68 Z M66 46 L78 48 M60 68 L52 52" fill="none" />
          </g>
          <g className="fill-accent">
            <circle cx="52" cy="52" r="2" />
            <circle cx="66" cy="46" r="2.4" />
            <circle cx="74" cy="60" r="1.8" />
            <circle cx="60" cy="68" r="2" />
            <circle cx="78" cy="48" r="1.4" />
          </g>
        </g>
        <circle
          className="intro-ring"
          pathLength={1}
          cx="62"
          cy="58"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          transform="rotate(-90 62 58)"
        />
        <path
          className="intro-handle"
          pathLength={1}
          d="M82 78 L102 98"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      <p className="mt-6 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">
        {letters(FIRST)}
        {letters(SECOND, "italic text-accent")}
      </p>
      <p className="intro-caption eyebrow mt-4 text-muted">Searching the scholarly record</p>

      <div className="mt-8 h-px w-40 bg-line-strong sm:w-56">
        <div className="intro-bar h-full w-full bg-accent" />
      </div>

      <p className="absolute bottom-6 left-6 eyebrow text-muted sm:bottom-8 sm:left-10">
        Tap or press any key to skip
      </p>
      <p className="absolute bottom-5 right-6 font-serif text-3xl text-ink [font-variant-numeric:lining-nums_tabular-nums] sm:bottom-7 sm:right-10 sm:text-4xl">
        <span className="intro-count" />
        <span className="text-accent">%</span>
      </p>
    </div>
  );
}
