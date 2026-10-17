"use client";

import ErrorState from "@/components/ErrorState";
import SiteHeader from "@/components/SiteHeader";

/** Route-level fallback for anything not caught closer to the failure. */
export default function RouteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  console.error(error);

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <ErrorState detail="The page failed to load." onRetry={retry} />
        </div>
      </main>
    </>
  );
}
