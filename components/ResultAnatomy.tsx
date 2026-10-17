import type { CSSProperties } from "react";

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const PARTS = [
  { label: "Title", body: "Links straight to the paper: its DOI when there is one, otherwise the publisher page." },
  { label: "Authors", body: "The first three names, then “et al.” when there are more." },
  { label: "Venue", body: "The journal, conference or repository where the work appeared." },
  { label: "Year", body: "Year of publication. Filter results by era with the year menu." },
  { label: "Citations", body: "How many other works in OpenAlex cite this one: a rough sense of its reach." },
  { label: "Copy reference", body: "Puts a simplified APA-style reference on your clipboard." },
];

function Marker({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent font-sans text-[0.65rem] font-semibold not-italic text-white"
    >
      {n}
    </span>
  );
}

/** "Read a result at a glance." An annotated example card. */
export default function ResultAnatomy() {
  return (
    <section aria-labelledby="anatomy-heading" id="anatomy" className="scroll-mt-8 border-t border-line">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <SectionHeading id="anatomy-heading" number="04" title="Read a result" accent="at a glance." />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <figure className="reveal-up lg:col-span-7" style={{ "--d": "0.1s" } as CSSProperties}>
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_30px_70px_-45px_rgba(80,45,25,0.6)] sm:p-8">
              <p className="eyebrow text-accent">No. 02</p>
              <p className="mt-2 flex items-start gap-3 font-serif text-[1.65rem] font-semibold leading-tight text-ink">
                <span className="text-balance">The Graph Neural Network Model</span>
                <Marker n={1} />
              </p>
              <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-ink-soft">
                Franco Scarselli, Marco Gori, Ah Chung Tsoi et al.
                <Marker n={2} />
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-2 italic">
                  IEEE Transactions on Neural Networks <Marker n={3} />
                </span>
                <span className="flex items-center gap-2">
                  2008 <Marker n={4} />
                </span>
                <span className="flex items-center gap-2 font-medium text-ink-soft">
                  9,520 citations <Marker n={5} />
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <p className="text-[0.8125rem] text-accent">
                  <span className="font-medium">DOI</span>{" "}
                  <span className="text-muted">10.1109/tnn.2008.2005605</span>
                </p>
                <span className="inline-flex items-center gap-2 rounded-md border border-line-strong px-2.5 py-1 text-xs font-medium text-ink-soft">
                  Copy reference <Marker n={6} />
                </span>
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-muted">
              Example result. Citation counts change as OpenAlex updates.
            </figcaption>
          </figure>

          <ol className="space-y-6 lg:col-span-5">
            {PARTS.map((part, i) => (
              <li
                key={part.label}
                className="reveal-up flex gap-4"
                style={{ "--d": `${0.2 + i * 0.07}s` } as CSSProperties}
              >
                <Marker n={i + 1} />
                <div>
                  <p className="font-serif text-xl font-semibold text-ink">{part.label}</p>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{part.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
