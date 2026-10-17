import Link from "next/link";
import type { CSSProperties } from "react";

import VantaBackground from "@/components/VantaBackground";

/** Landmark papers that float around the lens; each one runs a real search. */
const CLASSICS = [
  {
    year: "1948",
    title: "A Mathematical Theory of Communication",
    author: "C. E. Shannon",
    position: "left-0 top-[4%] sm:-left-6",
    style: { "--r": "-6deg", "--t": "7s" },
  },
  {
    year: "1953",
    title: "Molecular Structure of Nucleic Acids",
    author: "J. D. Watson & F. H. C. Crick",
    position: "right-0 top-[40%] sm:-right-4",
    style: { "--r": "5deg", "--t": "8.5s" },
  },
  {
    year: "1905",
    title: "On the Electrodynamics of Moving Bodies",
    author: "A. Einstein",
    position: "bottom-[2%] left-[6%]",
    style: { "--r": "-3deg", "--t": "9.5s" },
  },
];

/**
 * A magnifying lens with the Vanta network inside it: the "scope" in
 * ScholarScope. A dot orbits the lens on an ellipse.
 */
export default function HeroLens() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[460px] lg:max-w-[520px]">
      {/* Handle, behind the lens. */}
      <div
        aria-hidden="true"
        className="absolute bottom-[6%] right-[6%] h-[7%] w-[30%] origin-left translate-x-[2%] rotate-45 rounded-full bg-ink shadow-[0_12px_30px_-10px_rgba(28,25,21,0.5)]"
      />

      {/* Lens rim + glass. */}
      <div className="absolute inset-[10%] rounded-full border border-line-strong bg-surface p-[3%] shadow-[0_40px_90px_-50px_rgba(80,45,25,0.55)]">
        <div className="relative h-full w-full overflow-hidden rounded-full border border-line bg-surface">
          <VantaBackground />
          {/* Reticle. */}
          <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
            <g stroke="var(--color-accent)" strokeOpacity="0.45" strokeWidth="0.35">
              <path d="M50 4v8M50 88v8M4 50h8M88 50h8" />
              <circle cx="50" cy="50" r="2.2" fill="none" />
            </g>
            <circle cx="50" cy="50" r="49.5" fill="none" stroke="rgba(28,25,21,0.06)" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Orbit. */}
      <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <g transform="rotate(-18 50 50)">
          <ellipse cx="50" cy="50" rx="50" ry="16" fill="none" stroke="var(--color-accent)" strokeOpacity="0.4" strokeWidth="0.3" />
          <circle r="1.6" fill="var(--color-accent)">
            <animateMotion dur="14s" repeatCount="indefinite" path="M0,50 a50,16 0 1,0 100,0 a50,16 0 1,0 -100,0" />
          </circle>
        </g>
      </svg>

      {/* Floating index cards (sm and up; the lens alone reads better on phones). */}
      <ul className="hidden sm:block">
        {CLASSICS.map((paper) => (
          <li key={paper.title} className={`absolute w-44 ${paper.position}`}>
            <Link
              href={{ pathname: "/", query: { q: paper.title } }}
              className="drift block rounded-md border border-line bg-surface/95 p-3 shadow-[0_18px_40px_-24px_rgba(80,45,25,0.5)] transition-colors hover:border-accent"
              style={paper.style as CSSProperties}
            >
              <span className="eyebrow block text-accent">{paper.year}</span>
              <span className="mt-1 block font-serif text-[1.05rem] font-semibold leading-tight text-ink">
                {paper.title}
              </span>
              <span className="mt-1 block text-xs text-muted">{paper.author}</span>
              <span className="sr-only">: search for this paper</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
