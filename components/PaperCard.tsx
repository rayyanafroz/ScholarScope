import type { CSSProperties, ReactNode } from "react";

import CopyReference from "@/components/CopyReference";
import { formatReference } from "@/lib/cite";
import { formatAuthors, pluralize } from "@/lib/format";
import type { Paper } from "@/lib/openalex";

interface PaperCardProps {
  paper: Paper;
  /** Position in the visible list; drives the reveal stagger. */
  index: number;
  /** Relevance rank in the full result set (1-based). */
  rank: number;
}

const LINK_LABEL: Record<Paper["hrefKind"], string> = {
  doi: "DOI",
  landing: "Publisher page",
  openalex: "OpenAlex record",
};

export default function PaperCard({ paper, index, rank }: PaperCardProps) {
  const authors = formatAuthors(paper.authors, paper.authorCount);
  const doi = paper.hrefKind === "doi" ? paper.href.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "") : null;

  const meta: { key: string; node: ReactNode }[] = [];
  if (paper.venue) meta.push({ key: "venue", node: <span className="italic">{paper.venue}</span> });
  if (paper.year !== null) meta.push({ key: "year", node: <time dateTime={String(paper.year)}>{paper.year}</time> });
  if (paper.citations !== null) {
    meta.push({
      key: "citations",
      node: <span className="font-medium text-ink-soft">{pluralize(paper.citations, "citation")}</span>,
    });
  }

  return (
    <article
      data-reveal
      style={{ "--reveal-index": Math.min(index, 12) } as CSSProperties}
      className="group rounded-2xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_26px_50px_-34px_rgba(80,45,25,0.55)] sm:p-7"
    >
      <p className="eyebrow text-accent">No. {String(rank).padStart(2, "0")}</p>
      <h2 className="mt-2 font-serif text-[1.45rem] font-semibold leading-[1.15] text-ink sm:text-[1.65rem]">
        <a
          href={paper.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm decoration-accent/40 decoration-1 underline-offset-[6px] transition-colors hover:text-accent hover:underline"
        >
          {paper.title}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </h2>

      {authors && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{authors}</p>}

      {meta.length > 0 && (
        // Each item draws its "·" in the gap to its left. The first item on every
        // wrapped line has its dot outside the list box, where overflow-hidden clips it.
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 overflow-hidden text-sm text-muted">
          {meta.map((item) => (
            <li
              key={item.key}
              className="relative before:absolute before:-left-2.5 before:text-line-strong before:content-['·']"
            >
              {item.node}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-[0.8125rem]">
        <a
          href={paper.href}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 break-all rounded-sm text-accent hover:underline"
        >
          <span className="font-medium">{LINK_LABEL[paper.hrefKind]}</span>
          {doi && <span className="ml-1.5 text-muted">{doi}</span>}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        {paper.openAlexUrl && paper.hrefKind !== "openalex" && (
          <a
            href={paper.openAlexUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-muted hover:text-accent hover:underline"
          >
            OpenAlex record
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <span className="sm:ml-auto">
          <CopyReference reference={formatReference(paper)} />
        </span>
      </div>
    </article>
  );
}
