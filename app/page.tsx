import type { Metadata } from "next";
import { Suspense } from "react";

import Landing from "@/components/Landing";
import Results from "@/components/Results";
import ResultsBoundary from "@/components/ResultsBoundary";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import SearchBar from "@/components/SearchBar";
import SiteHeader from "@/components/SiteHeader";
import { normalizeQuery } from "@/lib/openalex";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const query = normalizeQuery((await searchParams).q);
  // The layout's title template only applies to child segments, so set it in full here.
  return query ? { title: { absolute: `“${query}” — ScholarScope` } } : {};
}

/**
 * `/`        -> landing page
 * `/?q=…`    -> results for that query
 *
 * searchParams are request data, so they are read inside <Suspense>; the
 * header and footer stay in the prerendered static shell.
 */
export default function Page({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <SearchView searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchView({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const query = normalizeQuery((await searchParams).q);
  if (!query) return <Landing />;

  return (
    <>
      <SiteHeader search={<SearchBar defaultValue={query} />} />
      <main id="main" className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14">
          <p className="eyebrow text-accent">Search results</p>
          <h1 className="mb-8 mt-3 text-pretty font-serif text-[2.4rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Results for <em className="break-words text-accent">“{query}”</em>
          </h1>
          {/* Keying by query resets the boundary, the skeleton and the year filter on each new search. */}
          <ResultsBoundary key={query}>
            <Suspense key={query} fallback={<ResultsSkeleton query={query} />}>
              <Results query={query} />
            </Suspense>
          </ResultsBoundary>
        </div>
      </main>
    </>
  );
}

function ShellFallback() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1" aria-busy="true" />
    </>
  );
}
