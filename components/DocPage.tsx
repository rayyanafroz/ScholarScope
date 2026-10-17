import type { ReactNode } from "react";

import SiteHeader from "@/components/SiteHeader";

interface DocPageProps {
  eyebrow: string;
  title: string;
  lede: string;
  updated?: string;
  children: ReactNode;
}

/**
 * Shared layout for About / Privacy: a single readable column, set like an
 * article. Children use the `doc-*` helpers below for consistent spacing.
 */
export default function DocPage({ eyebrow, title, lede, updated, children }: DocPageProps) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <article className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-ink sm:text-6xl">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{lede}</p>
          {updated && <p className="eyebrow mt-4 text-muted">Last updated {updated}</p>}
          <div className="mt-12 space-y-12 border-t border-line-strong pt-10">{children}</div>
        </article>
      </main>
    </>
  );
}

export function DocSection({ id, number, title, children }: { id?: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-heading` : undefined} className="scroll-mt-24">
      <h2 id={id ? `${id}-heading` : undefined} className="flex items-baseline gap-4 font-serif text-[1.85rem] font-semibold leading-tight text-ink">
        <span className="eyebrow font-sans text-accent">{number.padStart(2, "0")}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-ink-soft [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/30 [&_a]:underline-offset-2 [&_a:hover]:decoration-accent [&_code]:rounded [&_code]:bg-accent-soft [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-ink">
        {children}
      </div>
    </section>
  );
}
