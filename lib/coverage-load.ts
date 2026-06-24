import fs from "node:fs";
import path from "node:path";
import type {
  CoverageData,
  CoverageTotals,
  CovMarket,
  CovArchetype,
  CovMatrixCell,
  CovAuthority,
  CovArchAuthority,
  CovHs6,
  CovGeo,
} from "./coverage-data";

/* Server-only loader for the committed coverage snapshot (reads node:fs, so it
   must never be imported from a client component — the pure types/helpers live
   in coverage-data.ts). */

function readJson<T>(file: string): T {
  const p = path.join(process.cwd(), "public", "data", file);
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

let cache: CoverageData | null = null;

export function loadCoverageData(): CoverageData {
  if (cache) return cache;
  cache = {
    totals: readJson<CoverageTotals>("coverage-totals.json"),
    markets: readJson<CovMarket[]>("coverage-markets.json"),
    archetypes: readJson<CovArchetype[]>("coverage-archetypes.json"),
    matrix: readJson<CovMatrixCell[]>("coverage-matrix.json"),
    authorities: readJson<CovAuthority[]>("coverage-authorities.json"),
    archetypeAuthorities: readJson<CovArchAuthority[]>(
      "coverage-archetype-authorities.json",
    ),
    hs6: readJson<CovHs6[]>("coverage-hs6.json"),
    geo: readJson<CovGeo>("coverage-geo.json"),
  };
  return cache;
}
