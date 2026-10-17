import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ResultsList from "@/components/ResultsList";
import { searchPapers } from "@/lib/openalex";

/** Server component: fetches from OpenAlex and picks the right state. */
export default async function Results({ query }: { query: string }) {
  const outcome = await searchPapers(query);

  if (!outcome.ok) {
    return (
      <ErrorState
        detail={outcome.error.message}
        retryAfterSeconds={outcome.error.retryAfterSeconds}
      />
    );
  }

  const { papers, total } = outcome.data;
  if (papers.length === 0) return <EmptyState query={query} />;

  return <ResultsList papers={papers} total={total} />;
}
