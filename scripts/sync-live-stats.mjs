// Prebuild: regenerates lib/live-stats.json from the API's /v2/atlas/stats so
// every deploy ships fresh figures. Soft-fail: an unreachable API keeps the
// committed baseline (a stale-but-dated number beats a broken build).
import { readFileSync, writeFileSync } from "node:fs";
const OUT = new URL("../lib/live-stats.json", import.meta.url);
const KEY = process.env.LEGALDATA_API_KEY ?? "";
try {
  const r = await fetch("https://api.legaldata.cleolabs.co/v2/atlas/stats", {
    headers: KEY ? { Authorization: `Bearer ${KEY}` } : {},
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const { data } = await r.json();
  if (!data?.sources_active || !data?.documents_indexed) throw new Error("shape");
  writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(`[sync-live-stats] refreshed (as_of ${data.as_of})`);
} catch (e) {
  const stale = JSON.parse(readFileSync(OUT, "utf8"));
  console.warn(`[sync-live-stats] API unreachable (${e.message}) — keeping baseline as_of ${stale.as_of}`);
}
