import Form from "next/form";

import SearchShortcut from "@/components/SearchShortcut";
import { MAX_QUERY_LENGTH } from "@/lib/openalex";

interface SearchBarProps {
  defaultValue?: string;
  size?: "lg" | "md";
  /** Input id. The "/" shortcut targets the one with id="q". */
  id?: string;
}

/**
 * Submit-on-enter search. `next/form` turns a plain GET form into a client-side
 * navigation to `/?q=…`, so the URL is the single source of truth, results are
 * shareable, the back button works, and it still works without JavaScript.
 */
export default function SearchBar({ defaultValue = "", size = "md", id = "q" }: SearchBarProps) {
  const large = size === "lg";

  return (
    <Form action="/" role="search" aria-label="Search scholarly works" className="w-full">
      <label htmlFor={id} className="sr-only">
        Research topic
      </label>
      <div
        className={`group flex w-full items-center border border-line-strong bg-surface shadow-[0_1px_0_rgba(28,25,21,0.04),0_18px_40px_-28px_rgba(80,50,30,0.35)] transition-[border-color,box-shadow] focus-within:border-accent focus-within:shadow-[0_0_0_4px_var(--color-accent-soft)] ${
          large ? "rounded-2xl p-1.5 sm:p-2" : "rounded-xl p-1"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`shrink-0 fill-none stroke-muted ${large ? "ml-3 size-5" : "ml-2.5 size-4"}`}
        >
          <circle cx="8.5" cy="8.5" r="5.75" strokeWidth="1.75" />
          <path d="m13 13 4 4" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
        <input
          // Remount when the URL query changes so back/forward updates the text.
          key={defaultValue}
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={large ? "Search a research topic" : "Search papers"}
          required
          maxLength={MAX_QUERY_LENGTH}
          pattern=".*\S.*"
          title="Enter a research topic"
          autoComplete="off"
          enterKeyHint="search"
          className={`min-w-0 flex-1 bg-transparent text-ink placeholder:text-muted/80 focus:outline-none ${
            large ? "px-3 py-2.5 text-base sm:text-lg" : "px-2.5 py-1.5 text-base sm:text-[0.9375rem]"
          }`}
        />
        {id === "q" && <SearchShortcut />}
        <button
          type="submit"
          className={`inline-flex shrink-0 items-center gap-2 bg-accent font-medium text-white transition-colors hover:bg-accent-strong focus-visible:outline-offset-2 ${
            large ? "rounded-xl px-4 py-2.5 text-base sm:px-6" : "rounded-lg px-3.5 py-1.5 text-sm"
          }`}
        >
          Search
          {large && (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="hidden size-4 fill-none stroke-current sm:block">
              <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </Form>
  );
}
