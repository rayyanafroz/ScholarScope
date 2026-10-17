import Link from "next/link";

export default function EmptyState({ query }: { query: string }) {
  return (
    <div role="status" className="rounded-2xl border border-line bg-surface px-6 py-14 text-center sm:px-10">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto size-8 fill-none stroke-muted">
        <circle cx="10.5" cy="10.5" r="6.5" strokeWidth="1.5" />
        <path d="m15.5 15.5 5 5M8 10.5h5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h2 className="mt-4 font-serif text-[1.75rem] font-semibold leading-tight text-ink">
        No results for “<span className="break-words">{query}</span>”
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">
        Check the spelling, use fewer or broader keywords, or try the formal name of a method or
        concept.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg border border-line-strong px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
      >
        Start a new search
      </Link>
    </div>
  );
}
