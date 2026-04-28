// Mirror of DOMAIN_GROUPS in lib/types.ts — kept duplicated because the build
// script runs in plain Node and cannot import the .ts module.

export const DOMAIN_GROUPS = {
  ai_data: ["ai", "data_protection", "cyber"],
  health_safety: ["health", "safety"],
  finance_markets: ["finance", "competition", "consumer"],
  labor_tax: ["labor", "tax"],
  environment: ["environment"],
  ip_media: ["ip", "telecom"],
  generalist: ["generalist"],
};

export const DOMAIN_GROUP_ORDER = [
  "ai_data",
  "health_safety",
  "finance_markets",
  "labor_tax",
  "environment",
  "ip_media",
  "generalist",
];

export function groupOfDomain(d) {
  for (const g of DOMAIN_GROUP_ORDER) {
    if (DOMAIN_GROUPS[g].includes(d)) return g;
  }
  return "generalist";
}
