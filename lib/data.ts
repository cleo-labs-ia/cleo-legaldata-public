import fs from "node:fs";
import path from "node:path";
import type { DashboardData } from "./types";

let cache: DashboardData | null = null;

export function loadDashboardData(): DashboardData {
  if (cache) return cache;
  const file = path.join(process.cwd(), "public", "data", "manifest.json");
  cache = JSON.parse(fs.readFileSync(file, "utf8")) as DashboardData;
  return cache;
}
