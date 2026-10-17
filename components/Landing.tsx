import Link from "next/link";
import type { CSSProperties } from "react";

import FieldArches from "@/components/FieldArches";
import HeroHeadline from "@/components/HeroHeadline";
import HeroLens from "@/components/HeroLens";
import ResultAnatomy from "@/components/ResultAnatomy";
import SearchBar from "@/components/SearchBar";
import SiteHeader from "@/components/SiteHeader";
import ThreadTree from "@/components/ThreadTree";

const EXAMPLE_QUERIES = [
  "CRISPR off-target effects",
  "graph neural networks",
  "microplastics in drinking water",
  "large language model evaluation",
];

const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export default function Landing() {
  return (
    <>
      <SiteHeader overlay />
      <main id="main" className="flex flex-1 flex-col">
        {/* 01 — Hero */}
        <section aria-label="Search" className="relative">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-28 lg:pt-40">
            {/* Editorial rail */}
            <div aria-hidden="true" className="absolute left-4 top-36 hidden flex-col items-center gap-3 xl:flex">
              <span className="eyebrow text-accent">01</span>
              <span className="h-72 w-px bg-line-strong" />
            </div>

            <div className="min-w-0 lg:col-span-7">
              <p className="hero-rise eyebrow text-muted" style={d(0)}>
                Open scholarly search <span className="text-line-strong">/</span> powered by OpenAlex
              </p>
              <div className="mt-6">
                <HeroHeadline />
              </div>
              <p
                className="hero-rise mt-6 max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-muted sm:text-lg"
                style={d(0.35)}
              >
                ScholarScope searches the open OpenAlex index and lays out what matters to a researcher:
                who wrote it, where it appeared, and how often it has been cited since.
              </p>

              <div className="hero-rise mt-9 max-w-2xl" style={d(0.5)}>
                <SearchBar size="lg" />
              </div>

              <div className="hero-rise mt-6 max-w-2xl" style={d(0.62)}>
                <h2 className="eyebrow text-muted">Or begin with</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {EXAMPLE_QUERIES.map((query) => (
                    <li key={query}>
                      <Link
                        href={{ pathname: "/", query: { q: query } }}
                        className="inline-block rounded-full border border-line-strong bg-surface/70 px-3.5 py-1.5 font-serif text-[1.05rem] italic text-ink-soft transition-colors hover:border-accent hover:text-accent"
                      >
                        {query}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hero-rise min-w-0 lg:col-span-5" style={d(0.2)}>
              <HeroLens />
            </div>
          </div>
        </section>

        <ThreadTree />
        <FieldArches />
        <ResultAnatomy />

        {/* Closing call to action */}
        <section aria-labelledby="cta-heading" className="border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
            <p className="eyebrow text-accent">05</p>
            <h2 id="cta-heading" className="mt-4 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              Begin with a <em className="text-accent">question.</em>
            </h2>
            <div className="mx-auto mt-10 max-w-xl text-left">
              <SearchBar id="q-closing" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
