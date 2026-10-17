import Link from "next/link";
import type { CSSProperties } from "react";

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const QUESTION = "How do cities stay cool as the planet warms?";

const THREADS = [
  { title: "Urban heat islands", body: "Why cities run hotter than the land around them.", q: "urban heat island" },
  { title: "Green roofs", body: "Planted roofs as a passive cooling strategy.", q: "green roof cooling" },
  { title: "Cool pavements", body: "Reflective surfaces, albedo and street heat.", q: "cool pavement albedo" },
  { title: "Tree canopy", body: "How street trees shade and cool a block.", q: "urban tree canopy cooling" },
  { title: "Heat and health", body: "Heatwaves, mortality and who is most at risk.", q: "heatwave mortality cities" },
];

// Branch end x-positions in a 1000-wide viewBox: centres of five equal columns.
const BRANCH_X = [100, 300, 500, 700, 900];

/**
 * "One question. Many threads." A research question branches into five live
 * searches. Branches draw in on scroll; hovering a card lights its branch
 * (pure CSS :has(), see globals.css).
 */
export default function ThreadTree() {
  return (
    <section aria-labelledby="threads-heading" id="threads" className="scroll-mt-8 border-t border-line">
      <Reveal className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <SectionHeading id="threads-heading" number="02" title="One question." accent="Many threads.">
          <p>
            Research rarely starts with the right keywords. Start from a question, then pull on a
            thread. Every branch below is a live search.
          </p>
        </SectionHeading>

        <div className="thread-tree mt-16">
          <div
            className="reveal-up mx-auto max-w-md rounded-2xl border border-line bg-surface/80 px-6 py-7 text-center shadow-[0_24px_60px_-40px_rgba(80,45,25,0.5)]"
            style={{ "--d": "0.15s" } as CSSProperties}
          >
            <span aria-hidden="true" className="mx-auto mb-4 flex size-3 items-center justify-center rounded-full bg-accent-soft">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            <p className="eyebrow text-muted">A single question</p>
            <p className="mt-3 font-serif text-2xl italic leading-snug text-ink">{QUESTION}</p>
          </div>

          <svg
            aria-hidden="true"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="hidden h-24 w-full lg:block"
          >
            {BRANCH_X.map((x, i) => (
              <path
                key={x}
                data-branch={i}
                className="thread-path"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                style={{ "--d": `${0.25 + Math.abs(i - 2) * 0.12}s` } as CSSProperties}
                d={`M500,0 C500,70 ${x},40 ${x},120`}
              />
            ))}
          </svg>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:grid-cols-5 lg:gap-4">
            {THREADS.map((thread, i) => (
              <li
                key={thread.q}
                className="reveal-up"
                style={{ "--d": `${0.45 + i * 0.07}s` } as CSSProperties}
              >
                <Link
                  href={{ pathname: "/", query: { q: thread.q } }}
                  data-branch={i}
                  className="thread-branch group relative flex h-full flex-col rounded-xl border border-line bg-surface/80 p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_24px_50px_-30px_rgba(80,45,25,0.55)] lg:items-center lg:text-center"
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-[5px] left-1/2 hidden size-2.5 -translate-x-1/2 rounded-full border border-line-strong bg-paper transition-colors group-hover:border-accent group-hover:bg-accent lg:block"
                  />
                  <span className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-2 font-serif text-[1.45rem] font-semibold leading-tight text-ink">
                    {thread.title}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{thread.body}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-80 transition-opacity group-hover:opacity-100 lg:mt-auto lg:pt-4">
                    Follow this thread
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-none stroke-current transition-transform group-hover:translate-x-0.5">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
