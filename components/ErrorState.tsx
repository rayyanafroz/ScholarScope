"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ErrorStateProps {
  detail: string;
  retryAfterSeconds?: number;
  /** Defaults to re-rendering the current route on the server. */
  onRetry?: () => void;
}

export default function ErrorState({ detail, retryAfterSeconds, onRetry }: ErrorStateProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      if (onRetry) onRetry();
      else router.refresh();
    });
  }

  return (
    <div role="alert" className="rounded-2xl border border-line bg-surface px-6 py-14 text-center sm:px-10">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto size-8 fill-none stroke-ink-soft">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
        <path d="M12 7.5v5.5" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="16.25" r="1" className="fill-ink-soft stroke-none" />
      </svg>
      <h2 className="mt-4 font-serif text-[1.75rem] font-semibold leading-tight text-ink">Something went wrong — try again</h2>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-muted">{detail}</p>
      {retryAfterSeconds !== undefined && retryAfterSeconds > 0 && retryAfterSeconds < 3600 && (
        <p className="mt-1 text-sm text-muted">
          OpenAlex suggests waiting about {Math.ceil(retryAfterSeconds)} seconds.
        </p>
      )}
      <button
        type="button"
        onClick={retry}
        disabled={pending}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-wait disabled:opacity-80"
      >
        {pending && (
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 animate-spin fill-none stroke-current">
            <circle cx="8" cy="8" r="6" strokeWidth="2" className="opacity-30" />
            <path d="M14 8a6 6 0 0 0-6-6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {pending ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
