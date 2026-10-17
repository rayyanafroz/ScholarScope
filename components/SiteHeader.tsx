import type { ReactNode } from "react";

import Logo from "@/components/Logo";

interface SiteHeaderProps {
  /** Optional search bar; when present the header becomes sticky. */
  search?: ReactNode;
  /** Transparent header over the landing hero, with in-page section links. */
  overlay?: boolean;
}

const SECTIONS = [
  { href: "#threads", label: "Threads" },
  { href: "#fields", label: "Fields" },
  { href: "#anatomy", label: "Reading a result" },
];

export default function SiteHeader({ search, overlay = false }: SiteHeaderProps) {
  const position = search
    ? "sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md"
    : overlay
      ? "absolute inset-x-0 top-0 z-20"
      : "border-b border-line";

  return (
    <header className={position}>
      {/* Mobile: logo + link on one row, search wraps to a full-width row.
          sm and up: everything on one row. */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:flex-nowrap sm:px-6 sm:py-4 lg:px-10">
        <Logo />
        {search && (
          <div className="order-last w-full sm:order-none sm:max-w-xl sm:flex-1">{search}</div>
        )}
        {overlay && (
          <nav aria-label="Sections" className="mx-auto hidden items-center gap-8 lg:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="rounded font-serif text-lg text-ink-soft transition-colors hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </nav>
        )}
        <a
          href="https://openalex.org"
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 rounded text-sm text-muted transition-colors hover:text-accent ${
            overlay ? "ml-auto lg:ml-0" : "ml-auto"
          }`}
        >
          About the data
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </header>
  );
}
