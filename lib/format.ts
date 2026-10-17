const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

/** "A, B, C et al." — callers pass at most the first three names. */
export function formatAuthors(authors: string[], authorCount: number): string | null {
  if (authors.length === 0) return null;
  const list = authors.join(", ");
  return authorCount > authors.length ? `${list} et al.` : list;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}
