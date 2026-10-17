import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

interface Field {
  name: string;
  q: string;
  tone: string;
  featured?: boolean;
  glyph: ReactNode;
}

const stroke = { fill: "none", stroke: "#fff", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const FIELDS: Field[] = [
  {
    name: "Life sciences",
    q: "gene regulation",
    tone: "#8fa38f",
    glyph: (
      <g {...stroke}>
        <path d="M20 8c0 8 20 8 20 16s-20 8-20 16 20 8 20 16" />
        <path d="M40 8c0 8-20 8-20 16s20 8 20 16-20 8-20 16" />
        <path d="M23 16h14M23 32h14M23 48h14" strokeOpacity="0.6" />
      </g>
    ),
  },
  {
    name: "Physics",
    q: "quantum computing",
    tone: "#7d8aa1",
    glyph: (
      <g {...stroke}>
        <ellipse cx="30" cy="32" rx="22" ry="8" />
        <ellipse cx="30" cy="32" rx="22" ry="8" transform="rotate(60 30 32)" />
        <ellipse cx="30" cy="32" rx="22" ry="8" transform="rotate(-60 30 32)" />
        <circle cx="30" cy="32" r="2.5" fill="#fff" />
      </g>
    ),
  },
  {
    name: "Medicine",
    q: "randomized controlled trial",
    tone: "#b9806b",
    featured: true,
    glyph: (
      <g {...stroke}>
        <path d="M4 34h12l5-12 7 24 6-18 4 6h18" />
        <circle cx="30" cy="34" r="24" strokeOpacity="0.35" />
      </g>
    ),
  },
  {
    name: "Computing",
    q: "machine learning",
    tone: "#6f7778",
    glyph: (
      <g {...stroke}>
        <circle cx="14" cy="18" r="3" />
        <circle cx="14" cy="46" r="3" />
        <circle cx="46" cy="32" r="3" />
        <circle cx="30" cy="12" r="3" />
        <circle cx="30" cy="52" r="3" />
        <path d="M17 18l10-5M17 18l26 13M17 46l26-13M17 46l10 5M33 12l11 18M33 52l11-18" strokeOpacity="0.7" />
      </g>
    ),
  },
  {
    name: "Humanities",
    q: "digital humanities",
    tone: "#b79f72",
    glyph: (
      <g {...stroke}>
        <path d="M30 18c-6-4-14-5-22-4v32c8-1 16 0 22 4 6-4 14-5 22-4V14c-8-1-16 0-22 4z" />
        <path d="M30 18v32" />
        <path d="M14 24h10M14 30h10M36 24h10M36 30h10" strokeOpacity="0.6" />
      </g>
    ),
  },
];

/** "Wander a field." Arched doorways, each opening a search into a field. */
export default function FieldArches() {
  return (
    <section aria-labelledby="fields-heading" id="fields" className="scroll-mt-8 border-t border-line">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <SectionHeading id="fields-heading" number="03" title="Wander a" accent="field.">
          <p>
            Not sure where to begin? Step through a doorway into a well-trodden corner of research
            and see what the most-cited work looks like.
          </p>
        </SectionHeading>

        {/* Phones: a swipeable row. lg: five arches standing side by side. */}
        <ul className="-mx-4 mt-14 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-5 lg:overflow-visible lg:px-0">
          {FIELDS.map((field, i) => (
            <li
              key={field.name}
              className={`reveal-up shrink-0 snap-center ${field.featured ? "w-56 lg:flex-[1.5]" : "w-40 lg:flex-1"} lg:w-auto`}
              style={{ "--d": `${0.15 + i * 0.08}s` } as CSSProperties}
            >
              <Link
                href={{ pathname: "/", query: { q: field.q } }}
                className="group block rounded-t-full text-center"
              >
                <span
                  className={`relative block overflow-hidden rounded-t-full border-4 border-surface shadow-[0_30px_60px_-36px_rgba(60,35,20,0.6)] transition-transform duration-500 group-hover:-translate-y-2 ${
                    field.featured ? "h-80 lg:h-[26rem]" : "h-64 lg:h-80"
                  }`}
                  style={{ backgroundColor: field.tone }}
                >
                  <span aria-hidden="true" className="absolute inset-2 rounded-t-full border border-white/35" />
                  <span aria-hidden="true" className="absolute left-1/2 top-[22%] size-14 -translate-x-1/2 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-110" />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 60 64"
                    className="absolute bottom-[14%] left-1/2 w-[46%] -translate-x-1/2 transition-transform duration-500 group-hover:scale-105"
                  >
                    {field.glyph}
                  </svg>
                </span>
                <span className="mt-4 block font-serif text-2xl font-semibold text-ink transition-colors group-hover:text-accent">
                  {field.name}
                </span>
                <span className="eyebrow mt-1 block h-[2.6em] text-balance px-1 leading-[1.3] text-muted">{field.q}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
