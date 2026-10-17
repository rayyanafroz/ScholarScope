import type { CSSProperties, ReactNode } from "react";

interface SectionHeadingProps {
  id: string;
  number: string;
  title: string;
  /** Rendered in italic accent after the title. */
  accent: string;
  children?: ReactNode;
}

/** Editorial section opener: "02" numeral, serif title, side paragraph. */
export default function SectionHeading({ id, number, title, accent, children }: SectionHeadingProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="reveal-up lg:col-span-7">
        <p className="eyebrow text-accent">{number}</p>
        <h2
          id={id}
          className="mt-4 font-serif text-[2.6rem] font-medium leading-[1.02] tracking-tight text-balance text-ink sm:text-6xl"
        >
          {title} <em className="text-accent">{accent}</em>
        </h2>
      </div>
      {children && (
        <div
          className="reveal-up text-[1.0625rem] leading-relaxed text-muted lg:col-span-5 lg:self-end"
          style={{ "--d": "0.12s" } as CSSProperties}
        >
          {children}
        </div>
      )}
    </div>
  );
}
