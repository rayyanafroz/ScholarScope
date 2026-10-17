import type { NextRequest } from "next/server";

import { normalizeQuery, searchPapers, type SearchErrorKind } from "@/lib/openalex";

const STATUS_FOR: Record<SearchErrorKind, number> = {
  rate_limited: 429,
  invalid_query: 400,
  unauthorized: 502, // our server's key is the problem, not the caller's request
  upstream: 502,
  timeout: 504,
  network: 502,
  bad_response: 502,
};

/**
 * GET /api/search?q=… — the same normalised results the UI renders, as JSON.
 * The page itself does not call this; it uses lib/openalex directly from a
 * server component. This exists for scripts and future client features.
 */
export async function GET(request: NextRequest) {
  const query = normalizeQuery(request.nextUrl.searchParams.get("q"));
  if (!query) {
    return Response.json(
      { error: { kind: "invalid_query", message: "Missing ?q= search parameter." } },
      { status: 400 },
    );
  }

  const outcome = await searchPapers(query);

  if (!outcome.ok) {
    const headers = new Headers({ "Cache-Control": "no-store" });
    if (outcome.error.retryAfterSeconds !== undefined) {
      headers.set("Retry-After", String(Math.ceil(outcome.error.retryAfterSeconds)));
    }
    return Response.json({ error: outcome.error }, { status: STATUS_FOR[outcome.error.kind], headers });
  }

  return Response.json(outcome.data, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}
