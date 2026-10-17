"use client";

import { useMemo, useRef, useState } from "react";

import PaperCard from "@/components/PaperCard";
import YearFilter, { YEAR_RANGES } from "@/components/YearFilter";
import CountUp from "@/components/reactbits/CountUp";
import { formatNumber } from "@/lib/format";
import type { Paper } from "@/lib/openalex";
import { useReveal } from "@/lib/useReveal";

interface ResultsListProps {
  papers: Paper[];
  total: number | null;
}

/**
 * The year filter works on the 25 results already loaded (no extra request).
 * The parent is keyed by query, so the filter resets on every new search.
 */
export default function ResultsList({ papers, total }: ResultsListProps) {
  const [rangeId, setRangeId] = useState("all");
  const listRef = useRef<HTMLOListElement>(null);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        YEAR_RANGES.map((range) => [range.id, papers.filter((p) => range.matches(p.year)).length]),
      ),
    [papers],
  );

  const rankOf = useMemo(() => new Map(papers.map((p, i) => [p.id, i + 1])), [papers]);

  const range = YEAR_RANGES.find((r) => r.id === rangeId) ?? YEAR_RANGES[0];
  const visible = useMemo(() => papers.filter((p) => range.matches(p.year)), [papers, range]);
  const filtered = range.id !== "all";

  useReveal(listRef, visible);

  const summary = filtered
    ? `Showing ${visible.length} of the first ${papers.length} results, published ${range.label}.`
    : total !== null
      ? `Showing ${papers.length} of ~${formatNumber(total)} results.`
      : `Showing ${papers.length} results.`;

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p role="status" className="text-sm text-muted">
          <span className="sr-only">{summary}</span>
          <span aria-hidden="true">
            Showing <span className="font-medium text-ink">{visible.length}</span>
            {filtered ? (
              <> of the first {papers.length}</>
            ) : total !== null ? (
              <>
                {" "}
                of ~
                <CountUp
                  to={total}
                  from={Math.max(0, Math.round(total * 0.6))}
                  duration={0.9}
                  separator=","
                  trigger="load"
                  className="font-medium text-ink"
                />
              </>
            ) : null}{" "}
            results
          </span>
        </p>
        <YearFilter value={rangeId} counts={counts} onChange={setRangeId} />
      </div>

      {visible.length > 0 ? (
        <ol ref={listRef} className="mt-6 flex flex-col gap-4" aria-label="Search results">
          {visible.map((paper, index) => (
            <li key={paper.id}>
              <PaperCard paper={paper} index={index} rank={rankOf.get(paper.id) ?? index + 1} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-line-strong px-6 py-10 text-center">
          <p className="text-[0.9375rem] text-ink-soft">
            None of these {papers.length} results were published {range.label}.
          </p>
          <button
            type="button"
            onClick={() => setRangeId("all")}
            className="mt-3 rounded-md text-sm font-medium text-accent hover:underline"
          >
            Show all years
          </button>
        </div>
      )}
    </div>
  );
}
