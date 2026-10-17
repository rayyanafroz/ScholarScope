# ScholarScope — project brief

A scholarly search tool built as a finished, deployable product. Type a research
topic and get real papers from OpenAlex, with title, authors, year, citation
count and venue. Results are shareable through the URL, work at 375 px wide,
and have proper loading, empty and error states.

This document covers architecture and decisions. Setup and deployment are in
[README.md](README.md). Each file in the repo is the complete, runnable source.

---

## 1. Architecture summary

ScholarScope is one Next.js 16 App Router route (`/`) that renders either a
landing page or a results view, depending on the `?q=` search parameter. The URL
is the only state, so searches can be shared, bookmarked and navigated with
Back/Forward without client-side state management. Data comes from the OpenAlex
`/works` endpoint, fetched **server-side** in a React Server Component. The API
key stays on the server, there is no client data-fetching library, and results
stream into a `<Suspense>` boundary behind a skeleton while the header and
footer are served from the prerendered static shell (Partial Prerendering via
Cache Components, the Next 16 default). The fetch layer (`lib/openalex.ts`) is
the only module that knows OpenAlex's shape. It requests only the fields we
render (`select=`), and it applies a timeout, one bounded retry for 429/5xx, and
typed errors. It normalises raw works into a flat `Paper` type, so missing
fields can never reach the UI as "undefined". Successful searches are cached for
an hour per query (`"use cache"` + `cacheLife`). Failures are returned as values
with a zero cache lifetime, so Retry genuinely re-queries. Tailwind v4 keeps
styling in one token file, with a single Oxford-blue accent on warm off-white.
The motion stack (Vanta, Lenis, React Bits, optional GSAP) is decorative and
lazy-loaded: three.js loads only on the landing page after hydration, GSAP only
behind a flag, and all of it switches off for `prefers-reduced-motion`. That
keeps the core job — finding a paper — fast. There is no database, auth or
custom backend, as the brief required. Vercel runs the server component and the
`/api/search` route handler as functions.

### Design language

Inspired by the editorial calm of forklore.world, translated for research
rather than copied:

- **Look:** parchment and paper grain, a classical serif (Cormorant Garamond)
  with Inter, one sealing-wax accent, and chapter-numbered sections.
- **Intro:** the first visit opens with a CSS-only intro: a lens draws itself,
  the wordmark rises, a counter runs to 100%, then a curtain lifts.
- **Everything leads somewhere:** the floating classic papers, the question
  tree, the field arches and the example chips are all real searches.
- **Site furniture:** a full footer (columns, copyright, data attribution,
  "Cite this site"), static About and Privacy pages, and a Copy reference
  button on every result.

## 2. File tree

```
scholarscope/
├── app/
│   ├── about/page.tsx            About (static)
│   ├── api/search/route.ts       GET /api/search?q= → JSON (same data as the UI)
│   ├── privacy/page.tsx          Privacy (static)
│   ├── error.tsx                 Route-level error fallback
│   ├── globals.css               Tailwind v4 @theme tokens, intro, reveals
│   ├── icon.svg                  Favicon
│   ├── layout.tsx                Fonts, metadata, boot script, intro, Lenis, footer
│   └── page.tsx                  Landing vs results; Suspense + skeleton; metadata
├── components/
│   ├── reactbits/
│   │   ├── BlurText.tsx          React Bits (vendored, + as/start/highlight props)
│   │   └── CountUp.tsx           React Bits (vendored)
│   ├── CopyReference.tsx         Copy-to-clipboard reference button
│   ├── DocPage.tsx               Layout for About / Privacy
│   ├── EmptyState.tsx            "No results for X"
│   ├── ErrorState.tsx            "Something went wrong — try again" + Retry
│   ├── FieldArches.tsx           Arched doorways into fields
│   ├── HeroHeadline.tsx          BlurText h1, waits for the intro
│   ├── HeroLens.tsx              Lens with Vanta inside + floating classics
│   ├── Intro.tsx                 First-visit intro (CSS-animated markup)
│   ├── Landing.tsx               Landing page composition (sections 01–05)
│   ├── Logo.tsx
│   ├── PaperCard.tsx             One result card
│   ├── ResultAnatomy.tsx         Annotated example result
│   ├── Results.tsx               Server: fetch → error | empty | list
│   ├── ResultsBoundary.tsx       catchError() backstop for render errors
│   ├── ResultsList.tsx           Client: year filter, count line, list
│   ├── ResultsSkeleton.tsx       Loading skeleton
│   ├── Reveal.tsx                In-view flag for CSS reveals
│   ├── ScrollProgress.tsx        Accent scroll hairline
│   ├── SearchBar.tsx             next/form GET form, labelled input
│   ├── SearchShortcut.tsx        "/" focuses search
│   ├── SectionHeading.tsx        Numbered editorial section opener
│   ├── SiteFooter.tsx            Full footer: columns, ©, attribution, back to top
│   ├── SiteHeader.tsx            Logo, section links, or sticky search on results
│   ├── SmoothScroll.tsx          Lenis root scroller
│   ├── ThreadTree.tsx            Question → five live-search branches
│   ├── VantaBackground.tsx       Lazy Vanta NET + static fallback
│   └── YearFilter.tsx            Year-range select with per-range counts
├── lib/
│   ├── cite.ts                   Simplified APA reference formatting
│   ├── format.ts                 Number / author formatting
│   ├── motion.ts                 GSAP flag, pre-paint script (motion mode, intro)
│   ├── openalex.ts               Types, fetch, retry, cache, normalise
│   ├── useIntroDone.ts           True once the intro has lifted
│   ├── useReducedMotion.ts       prefers-reduced-motion hook
│   └── useReveal.ts              GSAP stagger for result cards
├── types/
│   └── vanta.d.ts                Types for Vanta's UMD bundle
├── .env.example
├── .gitignore
├── AGENTS.md                     Generated by Next.js for coding agents
├── eslint.config.mjs
├── next.config.ts                cacheComponents, partialPrefetching, Tailwind loader
├── package.json
├── README.md
├── SCHOLARSCOPE.md               This file
└── tsconfig.json
```

## 3. What each part does

### Data layer: `lib/openalex.ts`

- **Request**: `GET https://api.openalex.org/works?search=<q>&per-page=25&select=id,doi,title,display_name,publication_year,cited_by_count,authorships,primary_location`,
  plus `api_key` from `OPENALEX_API_KEY` and `mailto` from `OPENALEX_MAILTO`
  when each is set.
- **Types**: minimal interfaces (`OpenAlexWork`, `OpenAlexAuthorship`,
  `OpenAlexLocation`, `OpenAlexWorksResponse`) covering only the fields we
  read, all marked nullable.
- **Failure handling**:

  | Situation                        | Behaviour                                           |
  | -------------------------------- | --------------------------------------------------- |
  | 429 / 502 / 503 / 504            | One retry if `Retry-After` ≤ 2 s (750 ms if absent) |
  | 429 after retry                  | `rate_limited`, passes `retryAfterSeconds` to the UI |
  | 401 / 403                        | `unauthorized` (bad or missing key)                 |
  | Other 4xx                        | `invalid_query`                                     |
  | 5xx                              | `upstream`                                          |
  | No response in 10 s              | `timeout`                                           |
  | DNS / connection failure         | `network`                                           |
  | Body isn't JSON                  | `bad_response`                                      |

- **Normalisation to `Paper`**:
  - title is `display_name ?? title`, stripped of inline HTML, falling back to "Untitled work";
  - link is DOI, then `primary_location.landing_page_url`, then the OpenAlex record, `http(s)` only;
  - authors are the first three names plus a total count;
  - year and citation count are validated numbers or `null`;
  - venue is `primary_location.source.display_name` or `null`.
- **Caching**: `searchPapers()` is a `"use cache"` function. It sets
  `cacheLife("hours")` on success and a zero lifetime on failure. Errors are
  returned, not thrown, because a thrown error crossing a cache boundary is
  redacted in production and its type would be lost.

### UI states

| State   | Component                        | Trigger                                   |
| ------- | -------------------------------- | ----------------------------------------- |
| Landing | `Landing`                        | No `?q=` (or only whitespace)             |
| Loading | `ResultsSkeleton`                | Suspense fallback, keyed by query         |
| Results | `ResultsList` + `PaperCard`      | ≥ 1 paper                                 |
| Empty   | `EmptyState`                     | OpenAlex returned 0 works                 |
| Error   | `ErrorState`                     | Any typed fetch error; Retry → `router.refresh()` |
| Crash   | `ResultsBoundary`, `app/error.tsx` | Unexpected render error; Retry → `retry()` |

### Decisions

- **Submit-on-enter instead of debounce.** Each OpenAlex call spends budget, and
  researchers type whole phrases. Debouncing would fire on half-typed words
  ("graph neu…"), and every pause would push a history entry or need
  `replace` tricks. With submit-on-enter, one search makes one request and one
  history entry. Because it's a plain GET form (`next/form`), it also works
  before hydration or without JavaScript.
- **Server component over API route for the page.** The page calls
  `searchPapers()` directly, which skips a network hop and keeps the key
  server-side. `/api/search` reuses the same function for scripts and future
  client features.
- **Client-side year filter.** As the brief suggested, it filters only the 25
  loaded results. Each option shows its match count, and empty ranges are
  disabled, so you can't pick a range that returns nothing. The count line
  makes it explicit when a filter is active ("Showing 6 of the first 25").
- **Tailwind v4, so no `tailwind.config.ts`.** v4 is configured in CSS
  (`@theme` in `globals.css`). A config file would be legacy compatibility
  code, so the tokens live in one place.
- **GSAP optional.** It costs about 26 KB gzipped and only animates the cards'
  entrance. It's off by default and imported dynamically when
  `NEXT_PUBLIC_ENABLE_GSAP=true`. A CSS animation gives nearly the same effect
  at no cost. Verified: with the flag off, no GSAP chunk is downloaded.
- **three.js pinned to r134** for Vanta 0.5.x compatibility. Loaded after
  hydration on the landing page only (~147 KB gzipped). A static dot grid shows
  until it's ready and stays for reduced motion or missing WebGL.

### Unverified OpenAlex details (also noted in code comments)

- `authorships` is truncated to 100 authors in list responses, so `authorCount`
  is a lower bound for very large collaborations.
- `doi` is documented as a full `https://doi.org/…` URL. The code also accepts
  a bare `10.x/…` defensively.
- `x-ratelimit-reset` exists in responses, but its unit isn't clearly
  documented, so the code relies only on the standard `Retry-After` header.

## 4. Commands

Run locally:

```bash
cd scholarscope
npm install
cp .env.example .env.local     # add OPENALEX_API_KEY
npm run dev                    # http://localhost:3000
```

Production check:

```bash
npm run lint && npm run typecheck && npm run build && npm start
```

Deploy to Vercel (CLI):

```bash
npm i -g vercel
vercel login
vercel link
vercel env add OPENALEX_API_KEY production
vercel env add OPENALEX_MAILTO production      # optional
vercel --prod
```

Or import the Git repo at <https://vercel.com/new>. The README has the
step-by-step dashboard flow.

## 5. Verification done for the base version

Run against a local production build (`next build && next start`) with live
OpenAlex data, using headless Chromium:

- `npm run lint`, `npm run typecheck` and `npm run build` are clean. `/` builds
  as Partial Prerender (static shell + streamed results).
- Pressing `/` focuses search. Typing and pressing Enter navigates to
  `/?q=coral+reef+bleaching`, shows the skeleton, then renders 25 cards and
  "Showing 25 of ~34,256 results". The tab title is the query.
- The year filter narrows the list (25 → 2), updates the count line, and resets
  on a new search. Back restores the previous query and its results, then the
  landing page.
- Empty query (gibberish) shows "No results for …". An invalid API key shows
  "Something went wrong — try again" with the specific reason, and Retry makes
  a fresh OpenAlex request.
- Cache: 4 requests for one query made 1 OpenAlex call. 3 failing requests made
  3 calls (errors not cached).
- At 375 px and 1280 px: no horizontal overflow, no console errors, and the
  rendered text never contains "undefined" or "null".
- Motion modes: default (CSS reveal, Lenis, Vanta, no GSAP download), GSAP flag
  on (all 25 cards revealed by GSAP), and reduced motion (no Lenis, Vanta or
  GSAP; all content visible).

## 6. What I'd build next

1. **Pagination and sorting.** OpenAlex `page` / `cursor` plus
   `sort=cited_by_count:desc` and `sort=publication_date:desc`, kept in the URL
   like the query. Move the year filter to OpenAlex's
   `filter=publication_year:` so it covers all results, not just the first 25.
2. **Paper detail drawer.** Abstract (rebuilt from
   `abstract_inverted_index`), open-access PDF link and topics. Also BibTeX
   export alongside the existing Copy reference.
3. **Saved lists and alerts.** Starting with localStorage, then accounts if
   needed. Save papers to a reading list and get notified when a saved query
   has new highly cited work.
