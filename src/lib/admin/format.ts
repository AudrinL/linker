/**
 * Display helpers.
 *
 * Dates are formatted in Kigali time with an explicit locale, not the server's.
 * Netlify functions run in UTC on US hardware, so leaving either to the default
 * would show staff a timestamp hours off from the one the applicant saw.
 */

const TZ = "Africa/Kigali";
const LOCALE = "en-GB";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "3 days ago" — the column staff actually scan when triaging a queue. */
export function relativeTime(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  const formatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return formatter.format(-Math.round(seconds / size), unit);
    }
  }
  return "just now";
}

export function formatBytes(bytes?: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * `date_of_birth` and `dateOfBirth` both → `Date of birth`.
 *
 * Funnel answers arrive keyed by whatever the form config called them, so the
 * detail page has to label fields nobody wrote a label for. Sentence case
 * rather than title case, because these sit in a definition list beside
 * hand-written labels and title case would make them look like headings.
 */
export function humanizeKey(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
