"use client";

export interface YearRange {
  id: string;
  label: string;
  matches: (year: number | null) => boolean;
}

export const YEAR_RANGES: YearRange[] = [
  { id: "all", label: "Any year", matches: () => true },
  { id: "2020", label: "2020 – present", matches: (y) => y !== null && y >= 2020 },
  { id: "2010", label: "2010 – 2019", matches: (y) => y !== null && y >= 2010 && y <= 2019 },
  { id: "2000", label: "2000 – 2009", matches: (y) => y !== null && y >= 2000 && y <= 2009 },
  { id: "pre2000", label: "Before 2000", matches: (y) => y !== null && y < 2000 },
];

interface YearFilterProps {
  value: string;
  counts: Record<string, number>;
  onChange: (id: string) => void;
}

export default function YearFilter({ value, counts, onChange }: YearFilterProps) {
  return (
    <div className="flex items-center gap-2.5">
      <label htmlFor="year-filter" className="shrink-0 text-sm font-medium text-ink-soft">
        Published
      </label>
      <div className="relative w-full sm:w-auto">
        <select
          id="year-filter"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-line-strong bg-surface py-2 pl-3 pr-9 text-sm text-ink transition-colors hover:border-muted focus:border-accent sm:w-52"
        >
          {YEAR_RANGES.map((range) => {
            const count = counts[range.id] ?? 0;
            return (
              <option key={range.id} value={range.id} disabled={count === 0 && range.id !== value}>
                {range.label} ({count})
              </option>
            );
          })}
        </select>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 fill-none stroke-muted"
        >
          <path d="m4 6 4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
