import type { Paper } from "@/lib/openalex";

// Lower-case name particles that belong to the surname ("van Beethoven").
const PARTICLES = new Set(["van", "von", "der", "den", "de", "del", "della", "da", "di", "du", "la", "le", "dos", "das", "ter", "ten"]);

/** "Ah Chung Tsoi" → "Tsoi, A. C." · "Jean-Paul Sartre" → "Sartre, J.-P." */
export function toApaName(fullName: string): string {
  const tokens = fullName.trim().split(/\s+/).filter(Boolean);
  if (tokens.length < 2) return fullName.trim();

  let split = tokens.length - 1;
  for (let i = 1; i < tokens.length - 1; i++) {
    if (PARTICLES.has(tokens[i])) {
      split = i;
      break;
    }
  }

  const surname = tokens.slice(split).join(" ");
  const initials = tokens
    .slice(0, split)
    .map((given) =>
      given
        .split("-")
        .map((part) => (part.endsWith(".") ? part : `${part.charAt(0).toUpperCase()}.`))
        .join("-"),
    )
    .join(" ");
  return `${surname}, ${initials}`;
}

/**
 * A simplified APA-style reference built from the fields we have. OpenAlex
 * list responses don't include volume/issue/pages, so those are omitted; and
 * we only keep the first three authors, so longer lists end with "et al.".
 */
export function formatReference(paper: Paper): string {
  const names = paper.authors.map(toApaName);
  let authors = "";
  if (names.length === 1) authors = names[0];
  else if (names.length > 1) {
    authors =
      paper.authorCount > names.length
        ? `${names.join(", ")}, et al.`
        : `${names.slice(0, -1).join(", ")}, & ${names[names.length - 1]}`;
  }

  const year = paper.year !== null ? `(${paper.year})` : "(n.d.)";
  const title = /[.?!]$/.test(paper.title) ? paper.title : `${paper.title}.`;
  const venue = paper.venue ? ` ${paper.venue}.` : "";
  const lead = authors ? `${authors.replace(/\.$/, "")}. ${year}.` : `${title} ${year}.`;
  const body = authors ? ` ${title}${venue}` : venue;

  return `${lead}${body} ${paper.href}`.replace(/\s+/g, " ").trim();
}
