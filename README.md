# ScholarScope

A clean, fast search over the scholarly record. Type a research topic and get
real papers from [OpenAlex](https://openalex.org) with title, authors, year,
venue and citation count. Results live in the URL (`/?q=…`), so every search
can be shared and the back button works.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4. There is no
database and no auth. Data is fetched server-side from the OpenAlex API.

---

## 1. Get a free OpenAlex API key

1. Go to <https://openalex.org/settings/api> and sign in (or create a free account).
2. Copy your API key. The free tier includes a daily usage budget that is plenty
   for a personal or portfolio deployment.

The app works without a key, but anonymous requests share one small daily budget
for every user on the same IP address. On Vercel, that IP is shared with other
projects, so set a key for any public deployment.

## 2. Run locally

Requires Node.js 20.9 or newer.

```bash
git clone <your-repo-url> scholarscope
cd scholarscope
npm install
cp .env.example .env.local    # then paste your key into OPENALEX_API_KEY
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run build`     | Production build (also type-checks)            |
| `npm start`         | Serve the production build on port 3000        |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript)  |
| `npm run typecheck` | `tsc --noEmit`                                 |

## 3. Deploy to Vercel

### Option A: dashboard (no CLI)

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. Go to <https://vercel.com/new> and import the repository.
3. Vercel detects Next.js. Leave the build settings at their defaults.
4. Open **Environment Variables** and add:
   - `OPENALEX_API_KEY`: your key
   - `OPENALEX_MAILTO`: your email (optional)
   - `NEXT_PUBLIC_ENABLE_GSAP`: `true` or `false` (optional, defaults to off)
5. Click **Deploy**. Every later push to the main branch redeploys automatically.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link                                   # create or link the project
vercel env add OPENALEX_API_KEY production    # paste the key when prompted
vercel env add OPENALEX_MAILTO production     # optional
vercel --prod
```

If you change an environment variable later, redeploy. Variables that start
with `NEXT_PUBLIC_` are inlined at build time.

### Option C: Railway

Railway runs the app as a normal long-lived Node server, which suits ScholarScope
well: the one-hour search cache stays in memory between requests.

1. Push this repository to GitHub.
2. In [Railway](https://railway.com), choose **New Project → Deploy from GitHub
   repo** and pick the repository. Railway detects Next.js and runs
   `npm run build`, then `npm run start`. It supplies `PORT` automatically.
3. Open the service's **Variables** tab and add:
   - `OPENALEX_API_KEY`: your key
   - `OPENALEX_MAILTO`: your email (optional)
   - `NEXT_PUBLIC_ENABLE_GSAP`: `true` or `false` (optional; it is read at build
     time, so changing it triggers a rebuild)
4. Open **Settings → Networking → Generate Domain** to get a public
   `*.up.railway.app` URL. Add a custom domain here if you have one.
5. Every push to the connected branch redeploys. `railway.json` sets a health
   check on `/about`, so a broken build never replaces a working one.

## Environment variables

| Variable                  | Required    | Purpose                                                         |
| ------------------------- | ----------- | --------------------------------------------------------------- |
| `OPENALEX_API_KEY`        | Recommended | Sent as `api_key`. Gives the app its own daily budget.          |
| `OPENALEX_MAILTO`         | No          | Sent as `mailto`, OpenAlex's "polite pool" convention.          |
| `NEXT_PUBLIC_ENABLE_GSAP` | No          | `true` animates result cards with GSAP instead of CSS.          |

All of these are read on the server, except the GSAP flag. The API key never
reaches the browser.

## How it works

```
Browser ──GET /?q=topic──▶ app/page.tsx (server)
                              │  reads searchParams inside <Suspense>
                              ▼
                         components/Results.tsx (server)
                              │  searchPapers(query)  ── "use cache", 1 h per query
                              ▼
                         lib/openalex.ts ──fetch──▶ api.openalex.org/works
                              │  normalise → Paper[]       ?search=…&per-page=25&select=…
                              ▼
            ResultsList (client): year filter, count line, cards
```

- **Search is submit-on-enter, not debounced.** Each search spends OpenAlex
  budget, and researchers type full phrases, so querying on every pause would
  waste requests on half-typed words. It also keeps history clean: one search,
  one history entry, and Back behaves as expected. The form is a `next/form`
  GET form, so it still works with JavaScript disabled.
- **The URL is the state.** `/?q=` drives everything, so links can be shared
  and Back/Forward simply re-render.
- **Fetch layer** (`lib/openalex.ts`): 10 s timeout, one automatic retry for 429
  and 502/503/504 when `Retry-After` is 2 s or less, and typed errors
  (`rate_limited`, `unauthorized`, `invalid_query`, `upstream`, `timeout`,
  `network`, `bad_response`) that the UI turns into specific messages.
- **Caching**: successful searches are cached per query for an hour. Failures
  get a zero cache lifetime, so **Retry** really asks OpenAlex again.
- **Data hygiene**: only real OpenAlex fields are used. Titles are stripped of
  inline HTML, and links must be `http(s)`. A missing author, year, venue or
  citation count is omitted, never shown as "undefined".
- **Year filter**: filters the 25 loaded results in the browser. Each option
  shows how many results it matches.

### JSON endpoint

`GET /api/search?q=<topic>` returns the same normalised data the UI renders:

```json
{ "query": "…", "total": 964424, "papers": [{ "title": "…", "authors": ["…"], "authorCount": 5, "year": 2024, "citations": 459, "venue": "…", "href": "https://doi.org/…", "hrefKind": "doi", "openAlexUrl": "…", "id": "…" }] }
```

Errors come back as `{ "error": { "kind", "message" } }` with a matching status
code: 400, 429, 502 or 504.

## Design

An editorial, library-inspired look: warm parchment with a faint paper grain,
Cormorant Garamond for display type, Inter for reading text, and one
sealing-wax accent (`#8b3a2a`). Sections are numbered `01`–`05` like chapters.

The landing page has five parts:

1. **Hero:** the headline, the search bar, and a magnifying lens with a live
   citation-network animation (Vanta) inside it. Landmark papers (Shannon 1948,
   Watson & Crick 1953, Einstein 1905) float around the lens as index cards, and
   each one runs a search.
2. **One question, many threads:** a research question branches into five live
   searches. The branches draw in on scroll, and hovering a card lights its branch.
3. **Wander a field:** arched doorways into five fields, each opening a search.
4. **Read a result at a glance:** an annotated example result card.
5. **Begin with a question:** a closing search bar.

Each result card has a **Copy reference** button that copies a simplified
APA-style reference (`lib/cite.ts`).

Every page ends with a full site footer:
- the brand, and a "Cite this site" line;
- link columns: Explore, Project (About, JSON API, Accessibility, Privacy) and
  Data (OpenAlex, API docs, CC0 licence);
- a legal bar with the copyright, data attribution and a back-to-top link.

`/about` and `/privacy` are static pages in the same style.

### Intro

On the first visit in a browser session, a short intro plays: the lens draws
itself, the wordmark rises, a counter runs to 100%, then the sheet lifts away
(about 2.5 s). It is plain HTML and CSS, started by a tiny inline script before
first paint, so it needs no JavaScript bundle and never waits on one.

- It plays once per session, only on the landing page. A shared `/?q=` link
  goes straight to results.
- Any click, tap or key press skips it.
- It never plays for reduced-motion users.
- three.js and Vanta load behind the curtain, so the hero is ready when it lifts.

## Front-end motion

The site is built for reading first. Every effect is decorative, lazy-loaded,
and turned off when the OS asks for reduced motion.

| Library                                         | Where                                     | Cost and loading                                 |
| ----------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| [Vanta.js](https://www.vantajs.com) `NET` + three.js r134 | Inside the hero lens               | ~147 KB gzip, imported after hydration, landing page only |
| [Lenis](https://lenis.darkroom.engineering)     | Smooth scrolling site-wide                | Small; off for reduced motion                    |
| [React Bits](https://reactbits.dev) `BlurText`, `CountUp` | Hero headline (starts when the intro lifts), result-count number | Uses `motion`; source vendored in `components/reactbits/` |
| CSS only                                        | Intro, scroll-progress line, section reveals, thread-tree drawing, floating cards | No library cost |
| [GSAP](https://gsap.com)                        | Result-card stagger (optional)            | ~26 KB gzip, downloaded only when `NEXT_PUBLIC_ENABLE_GSAP=true` |

Notes:

- three.js is pinned to **0.134.0**, the last release Vanta 0.5.x is known to work with.
- With GSAP off, cards use a CSS animation with the same feel. A small script in
  `<head>` picks the mode before first paint, so cards never flash. If GSAP
  fails to load, cards still appear after 1.6 s.
- The React Bits files were added with their registry code and lightly
  edited. `BlurText` gained three props: `as` (render the page `<h1>`), `start`
  (wait for the intro to finish) and `highlight` (italicise "conversation.").
  They are excluded from ESLint as vendored code.

## Accessibility

- A labelled search input inside `role="search"`, visible focus rings, and a
  "Skip to content" link.
- Press `/` to focus search.
- Semantic structure: one `<h1>` per view, `<article>` cards in an `<ol>`, and
  `<time>` for publication years.
- Loading, empty and error states use `role="status"` or `role="alert"`, so
  screen readers announce them.
- External links say "(opens in a new tab)" to screen readers.
- Contrast (WCAG): body text is 15.2:1, muted text 5.3:1 and accent 6.6:1 on
  the parchment background. White text on the accent button is 7.7:1.
- The intro overlay is `aria-hidden`, and the page content is in the DOM underneath
  it from the start.

## Project structure

```
app/
  layout.tsx            Root layout: fonts, metadata, boot script, intro, Lenis, footer
  page.tsx              Landing (no ?q) or results view (?q=…)
  about/page.tsx        About: what it is, data, how it works, API, accessibility, credits
  privacy/page.tsx      Privacy: no accounts, no cookies, no analytics
  error.tsx             Route-level error fallback
  globals.css           Tailwind v4 theme tokens, intro, reveals
  icon.svg              Favicon
  api/search/route.ts   JSON endpoint
components/
  Intro.tsx             First-visit intro (markup; animated by CSS)
  Landing.tsx           Landing page: hero + sections 02–05
  HeroHeadline.tsx      BlurText <h1>, held until the intro lifts
  HeroLens.tsx          Magnifying lens with Vanta inside + floating classics
  ThreadTree.tsx        "One question. Many threads." branching searches
  FieldArches.tsx       "Wander a field." arched doorways
  ResultAnatomy.tsx     "Read a result at a glance." annotated card
  SectionHeading.tsx    Numbered editorial section opener
  Reveal.tsx            Marks a section in-view for CSS reveals
  ScrollProgress.tsx    Accent hairline that fills as you scroll
  SiteHeader.tsx        Logo, section links (landing) or sticky search (results)
  SiteFooter.tsx        Full site footer: columns, copyright, attribution
  DocPage.tsx           Layout for About / Privacy
  SearchBar.tsx         next/form GET form, labelled input
  SearchShortcut.tsx    "/" to focus search
  Results.tsx           Server component: fetch → error / empty / list
  ResultsList.tsx       Client: year filter, count line, cards
  PaperCard.tsx         One result
  CopyReference.tsx     Copy-to-clipboard reference button (with non-HTTPS fallback)
  YearFilter.tsx        Year-range <select>
  ResultsSkeleton.tsx   Loading state
  EmptyState.tsx        "No results for X"
  ErrorState.tsx        "Something went wrong — try again" + Retry
  ResultsBoundary.tsx   Error boundary backstop (next/error catchError)
  VantaBackground.tsx   Lazy Vanta NET with static dot-grid fallback
  SmoothScroll.tsx      Lenis
  Logo.tsx
  reactbits/            Vendored React Bits components
lib/
  openalex.ts           Types, fetch layer, retries, caching, normalisation
  cite.ts               Simplified APA reference formatting
  format.ts             Number and author formatting
  motion.ts             GSAP flag + pre-paint script (motion mode, intro)
  useIntroDone.ts       True once the intro has lifted
  useReducedMotion.ts   prefers-reduced-motion hook
  useReveal.ts          GSAP card reveal
types/vanta.d.ts        Types for Vanta's UMD bundle
```
