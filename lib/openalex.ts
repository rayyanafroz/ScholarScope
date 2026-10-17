import "server-only";

import { cacheLife } from "next/cache";

/* -------------------------------------------------------------------------- */
/*  OpenAlex response types (only the fields this app reads)                  */
/*  Reference: https://docs.openalex.org/api-entities/works/work-object       */
/* -------------------------------------------------------------------------- */

export interface OpenAlexAuthorship {
  author?: {
    display_name?: string | null;
  } | null;
}

export interface OpenAlexSource {
  display_name?: string | null;
}

export interface OpenAlexLocation {
  landing_page_url?: string | null;
  // `source` is null for many repository / web-only locations.
  source?: OpenAlexSource | null;
}

export interface OpenAlexWork {
  id: string; // e.g. "https://openalex.org/W4392553889"
  doi?: string | null; // OpenAlex returns the full URL: "https://doi.org/10.…"
  title?: string | null;
  display_name?: string | null; // Same value as `title`; documented as an alias.
  publication_year?: number | null;
  cited_by_count?: number | null;
  // OpenAlex truncates `authorships` to the first 100 authors in list
  // responses, so its length is a lower bound for very large collaborations.
  authorships?: OpenAlexAuthorship[] | null;
  primary_location?: OpenAlexLocation | null;
}

export interface OpenAlexWorksResponse {
  meta?: {
    count?: number | null;
  } | null;
  results?: OpenAlexWork[] | null;
}

/* -------------------------------------------------------------------------- */
/*  App-level types (what the UI consumes)                                    */
/* -------------------------------------------------------------------------- */

export interface Paper {
  id: string;
  title: string;
  /** Best link to the paper itself: DOI, then landing page, then OpenAlex. */
  href: string;
  hrefKind: "doi" | "landing" | "openalex";
  /** The work's record on openalex.org, when the id is a valid URL. */
  openAlexUrl: string | null;
  /** First three author names only; `authorCount` holds the full count. */
  authors: string[];
  authorCount: number;
  year: number | null;
  citations: number | null;
  venue: string | null;
}

export interface SearchResults {
  query: string;
  /** Approximate total hits reported by OpenAlex (`meta.count`). */
  total: number | null;
  papers: Paper[];
}

export type SearchErrorKind =
  | "rate_limited"
  | "invalid_query"
  | "unauthorized"
  | "upstream"
  | "timeout"
  | "network"
  | "bad_response";

export interface SearchError {
  kind: SearchErrorKind;
  message: string;
  status?: number;
  retryAfterSeconds?: number;
}

export type SearchOutcome =
  | { ok: true; data: SearchResults }
  | { ok: false; error: SearchError };

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const WORKS_ENDPOINT = "https://api.openalex.org/works";
export const PER_PAGE = 25;
export const MAX_QUERY_LENGTH = 200;
const AUTHORS_SHOWN = 3;
const REQUEST_TIMEOUT_MS = 10_000;
// If OpenAlex asks us to wait longer than this, fail fast and let the user retry
// instead of holding the request open.
const MAX_INLINE_RETRY_WAIT_MS = 2_000;

// `select` trims each work down to the fields we render, which makes the
// response roughly an order of magnitude smaller than the full work object.
const SELECT_FIELDS = [
  "id",
  "doi",
  "title",
  "display_name",
  "publication_year",
  "cited_by_count",
  "authorships",
  "primary_location",
].join(",");

const ERROR_MESSAGES: Record<SearchErrorKind, string> = {
  rate_limited:
    "OpenAlex is limiting requests right now. Wait a few seconds and try again.",
  invalid_query:
    "OpenAlex couldn't process that query. Try simpler keywords.",
  unauthorized:
    "The server's OpenAlex API key was rejected. Check OPENALEX_API_KEY.",
  upstream: "OpenAlex is having trouble responding right now.",
  timeout: "OpenAlex took too long to respond.",
  network: "We couldn't reach OpenAlex. Check your connection.",
  bad_response: "OpenAlex returned a response we couldn't read.",
};

class OpenAlexRequestError extends Error {
  constructor(
    readonly kind: SearchErrorKind,
    readonly status?: number,
    readonly retryAfterSeconds?: number,
  ) {
    super(ERROR_MESSAGES[kind]);
    this.name = "OpenAlexRequestError";
  }
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/** Trims, collapses whitespace and caps length. Returns "" for no query. */
export function normalizeQuery(raw: string | string[] | undefined | null): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
}

/**
 * Searches OpenAlex and never throws: failures come back as a typed error the
 * UI and the JSON route can render directly.
 *
 * Successful results are cached per query for an hour. Failures are returned
 * (not thrown, because errors crossing a "use cache" boundary are redacted in
 * production) with a zero cache lifetime, so "Retry" really calls OpenAlex
 * again.
 */
export async function searchPapers(query: string): Promise<SearchOutcome> {
  "use cache";

  try {
    const data = await fetchWorks(query);
    cacheLife("hours");
    return { ok: true, data };
  } catch (error) {
    cacheLife({ stale: 0, revalidate: 0, expire: 0 });

    if (error instanceof OpenAlexRequestError) {
      return {
        ok: false,
        error: {
          kind: error.kind,
          message: error.message,
          ...(error.status !== undefined && { status: error.status }),
          ...(error.retryAfterSeconds !== undefined && {
            retryAfterSeconds: error.retryAfterSeconds,
          }),
        },
      };
    }
    console.error("[openalex] unexpected error", error);
    return {
      ok: false,
      error: { kind: "network", message: ERROR_MESSAGES.network },
    };
  }
}

/* -------------------------------------------------------------------------- */
/*  Fetch layer                                                               */
/* -------------------------------------------------------------------------- */

async function fetchWorks(query: string): Promise<SearchResults> {
  const response = await requestWithRetry(buildUrl(query));

  let body: OpenAlexWorksResponse;
  try {
    body = (await response.json()) as OpenAlexWorksResponse;
  } catch {
    throw new OpenAlexRequestError("bad_response", response.status);
  }

  const works = Array.isArray(body.results) ? body.results : [];
  const total = body.meta?.count;

  return {
    query,
    total: typeof total === "number" && Number.isFinite(total) ? total : null,
    papers: works.filter(isWork).map(toPaper),
  };
}

function buildUrl(query: string): URL {
  const url = new URL(WORKS_ENDPOINT);
  url.searchParams.set("search", query);
  url.searchParams.set("per-page", String(PER_PAGE));
  url.searchParams.set("select", SELECT_FIELDS);

  const apiKey = process.env.OPENALEX_API_KEY?.trim();
  if (apiKey) {
    url.searchParams.set("api_key", apiKey);
  } else {
    warnOnce(
      "OPENALEX_API_KEY is not set. Requests share OpenAlex's small anonymous " +
        "budget for this IP address and will be rate limited quickly.",
    );
  }

  const mailto = process.env.OPENALEX_MAILTO?.trim();
  if (mailto) url.searchParams.set("mailto", mailto);

  return url;
}

/**
 * One request plus at most one retry for transient failures (429 and 5xx),
 * and only when the wait is short enough to keep the page responsive.
 */
async function requestWithRetry(url: URL): Promise<Response> {
  let response = await request(url);

  if (isTransient(response.status)) {
    const waitMs = retryDelayMs(response);
    if (waitMs <= MAX_INLINE_RETRY_WAIT_MS) {
      await sleep(waitMs);
      response = await request(url);
    }
  }

  if (response.ok) return response;

  const retryAfter = parseRetryAfter(response.headers.get("retry-after"));

  if (response.status === 429) {
    throw new OpenAlexRequestError("rate_limited", 429, retryAfter);
  }
  if (response.status === 401 || response.status === 403) {
    throw new OpenAlexRequestError("unauthorized", response.status);
  }
  if (response.status >= 400 && response.status < 500) {
    throw new OpenAlexRequestError("invalid_query", response.status);
  }
  throw new OpenAlexRequestError("upstream", response.status, retryAfter);
}

async function request(url: URL): Promise<Response> {
  try {
    return await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new OpenAlexRequestError("timeout");
    }
    throw new OpenAlexRequestError("network");
  }
}

function isTransient(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
}

function retryDelayMs(response: Response): number {
  const seconds = parseRetryAfter(response.headers.get("retry-after"));
  // No Retry-After header: back off briefly once.
  return seconds === undefined ? 750 : seconds * 1000;
}

/**
 * Retry-After may be delta-seconds or an HTTP date (RFC 9110 §10.2.3).
 * OpenAlex also sends X-RateLimit-Reset, but its unit/semantics aren't clearly
 * documented, so we deliberately rely on the standard header only.
 */
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds;
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let warned = false;
function warnOnce(message: string) {
  if (warned) return;
  warned = true;
  console.warn(`[openalex] ${message}`);
}

/* -------------------------------------------------------------------------- */
/*  Normalisation: raw OpenAlex work -> Paper                                 */
/* -------------------------------------------------------------------------- */

function isWork(value: unknown): value is OpenAlexWork {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as OpenAlexWork).id === "string"
  );
}

function toPaper(work: OpenAlexWork): Paper {
  const authors = (work.authorships ?? [])
    .map((a) => cleanText(a?.author?.display_name))
    .filter((name): name is string => Boolean(name));

  const doiUrl = toDoiUrl(work.doi);
  const landingUrl = safeHttpUrl(work.primary_location?.landing_page_url);
  const openAlexUrl = safeHttpUrl(work.id);

  const href = doiUrl ?? landingUrl ?? openAlexUrl ?? "https://openalex.org";
  const hrefKind = doiUrl ? "doi" : landingUrl ? "landing" : "openalex";

  return {
    id: work.id,
    title: cleanText(work.display_name ?? work.title) ?? "Untitled work",
    href,
    hrefKind,
    openAlexUrl,
    authors: authors.slice(0, AUTHORS_SHOWN),
    authorCount: authors.length,
    year: toYear(work.publication_year),
    citations: toCount(work.cited_by_count),
    venue: cleanText(work.primary_location?.source?.display_name),
  };
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/**
 * OpenAlex titles sometimes carry inline markup from publisher metadata
 * (e.g. "<i>E. coli</i>", "CO<sub>2</sub>"). We render plain text, so strip
 * tags and decode the handful of entities that appear in practice.
 */
function cleanText(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const text = value
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0 ? text : null;
}

function toDoiUrl(doi: string | null | undefined): string | null {
  if (typeof doi !== "string" || !doi.trim()) return null;
  const value = doi.trim();
  // Documented as a full https://doi.org/ URL; accept a bare "10.x/…" defensively.
  if (/^10\.\d{4,}\//.test(value)) return `https://doi.org/${value}`;
  return safeHttpUrl(value);
}

/** Only allow http(s) links into hrefs (no javascript:, data:, etc.). */
function safeHttpUrl(value: string | null | undefined): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function toYear(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;
}

function toCount(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}
