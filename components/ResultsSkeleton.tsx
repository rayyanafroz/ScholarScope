const ROWS = 5;

export default function ResultsSkeleton({ query }: { query: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading results for “{query}”…</span>

      <div aria-hidden="true">
        {/* A small lens sweeping along a rule while OpenAlex answers. */}
        <div className="flex items-center gap-4 border-b border-line pb-4">
          <span className="eyebrow shrink-0 text-muted">Consulting the index</span>
          <div className="relative h-5 flex-1 overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
            <svg viewBox="0 0 20 20" className="scan absolute top-0 size-5 fill-none stroke-accent">
              <circle cx="8.5" cy="8.5" r="5" strokeWidth="1.75" className="fill-paper" />
              <path d="m12.5 12.5 4 4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <ul className="mt-5 flex animate-pulse flex-col gap-3">
          {Array.from({ length: ROWS }, (_, i) => (
            <li key={i} className="rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <div className="h-3 w-12 rounded bg-accent-soft" />
              <div className="mt-3 h-6 w-11/12 rounded bg-line" />
              <div className="mt-2 h-6 w-2/3 rounded bg-line" />
              <div className="mt-4 h-3.5 w-1/2 rounded bg-line/80" />
              <div className="mt-4 flex gap-3">
                <div className="h-3.5 w-28 rounded bg-line/80" />
                <div className="h-3.5 w-10 rounded bg-line/80" />
                <div className="h-3.5 w-20 rounded bg-line/80" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
