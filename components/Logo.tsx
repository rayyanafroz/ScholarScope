import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-2 rounded-md text-ink"
      aria-label="ScholarScope home"
    >
      <svg viewBox="0 0 32 32" className="size-7 text-accent" aria-hidden="true">
        <circle cx="13.5" cy="13.5" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20 26.5 26.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="11" cy="12" r="1.4" fill="currentColor" />
        <circle cx="16" cy="11" r="1.1" fill="currentColor" />
        <circle cx="14" cy="16" r="1.2" fill="currentColor" />
        <path d="M11 12 16 11 14 16Z" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      </svg>
      <span className="font-serif text-[1.6rem] font-medium leading-none tracking-tight">
        Scholar<span className="italic text-accent">Scope</span>
      </span>
    </Link>
  );
}
