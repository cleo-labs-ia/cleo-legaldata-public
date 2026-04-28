// Best-effort volume extraction from free-text source notes.
// Returns the estimated number of indexed documents/decisions for a source,
// or null when no reliable volume could be parsed.

const NOUNS =
  "documents?|judgments?|decisions?|records?|articles?|cases?|laws?|texts?|opinions?|rulings?|publications?|pages?|items?|datasets?|entries?|gazettes?|consultations?|guidelines?|circulars?|reports?";

const VOLUME_RE = new RegExp(
  // optional ~ then number with thousand separators, optional decimal,
  // optional K/M/B suffix, optional + sign, then the noun.
  String.raw`~?\s*(\d[\d,]*(?:\.\d+)?)\s*([KkMmBb])?\+?\s*(?:` + NOUNS + String.raw`)\b`,
  "g"
);

const SKIP_FRAGMENT_RE =
  /\b(sample|samples|avg|average|chars?|characters|kb|kbytes|bytes|tokens?|words?|requests?|ecli\/year|per[ -]year|years?|months?|weeks?|days?|hours?|minutes?|seconds?)\b/i;

function parseNumber(numStr, suffix) {
  let n = parseFloat(numStr.replace(/,/g, ""));
  if (Number.isNaN(n)) return 0;
  const s = (suffix || "").toLowerCase();
  if (s === "k") n *= 1_000;
  else if (s === "m") n *= 1_000_000;
  else if (s === "b") n *= 1_000_000_000;
  return Math.round(n);
}

export function extractVolume(notes) {
  if (!notes || typeof notes !== "string") return null;
  // Split into sentence-ish fragments to scope the noisy-keyword filter.
  const fragments = notes.split(/(?<=[.!?;])\s+|\n+/);
  let best = 0;
  for (const frag of fragments) {
    if (SKIP_FRAGMENT_RE.test(frag)) continue;
    VOLUME_RE.lastIndex = 0;
    let m;
    while ((m = VOLUME_RE.exec(frag)) !== null) {
      const n = parseNumber(m[1], m[2]);
      // 50 is the floor: smaller numbers in notes are almost always
      // sample sizes, version numbers or example counts.
      if (n >= 50) best = Math.max(best, n);
    }
  }
  return best > 0 ? best : null;
}
