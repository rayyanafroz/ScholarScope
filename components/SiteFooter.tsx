import Link from "next/link";

// Evaluated once when the module loads (at build or server start), not per render.
const YEAR = new Date().getFullYear();

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Search", href: "/" },
      { label: "Threads", href: "/#threads" },
      { label: "Fields", href: "/#fields" },
      { label: "Reading a result", href: "/#anatomy" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "About", href: "/about" },
      { label: "JSON API", href: "/about#api" },
      { label: "Accessibility", href: "/about#accessibility" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Data",
    links: [
      { label: "OpenAlex", href: "https://openalex.org", external: true },
      { label: "API documentation", href: "https://docs.openalex.org", external: true },
      { label: "CC0 licence", href: "https://creativecommons.org/publicdomain/zero/1.0/", external: true },
    ],
  },
];

const linkClass =
  "rounded-sm text-[0.9375rem] text-paper/70 underline-offset-4 transition-colors hover:text-paper hover:underline";

function FooterAnchor({ link }: { link: FooterLink }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {link.label}
        <span aria-hidden="true" className="ml-1 text-paper/40">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-16 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + how to cite the site */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md" aria-label="ScholarScope home">
              <svg viewBox="0 0 32 32" className="size-7 text-accent-soft" aria-hidden="true">
                <circle cx="13.5" cy="13.5" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20 26.5 26.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                <circle cx="11" cy="12" r="1.4" fill="currentColor" />
                <circle cx="16" cy="11" r="1.1" fill="currentColor" />
                <circle cx="14" cy="16" r="1.2" fill="currentColor" />
              </svg>
              <span className="font-serif text-[1.75rem] font-medium leading-none tracking-tight">
                Scholar<span className="italic text-accent-soft">Scope</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-paper/70">
              A clean, fast way to search the scholarly record, built on open data from OpenAlex.
            </p>
            <div className="mt-6 max-w-sm border-l-2 border-accent pl-4">
              <p className="eyebrow text-paper/60">Cite this site</p>
              <p className="mt-1.5 font-serif text-[1.05rem] italic leading-relaxed text-paper/85">
                ScholarScope ({YEAR}). <span className="not-italic">A search interface for the scholarly record.</span>
              </p>
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="eyebrow text-accent-soft">{col.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Legal bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; {YEAR} ScholarScope. All rights reserved.</p>
          <p>
            Scholarly metadata from{" "}
            <a
              href="https://openalex.org"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm text-paper/80 underline decoration-paper/30 underline-offset-2 hover:text-paper hover:decoration-paper"
            >
              OpenAlex
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            , released under CC0.
          </p>
          <a href="#top" className="rounded-sm text-paper/80 transition-colors hover:text-paper">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
