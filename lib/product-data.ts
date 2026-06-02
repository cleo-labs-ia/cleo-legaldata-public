import fs from "node:fs";
import path from "node:path";

export interface ProductCategory {
  name: string;
  description: string;
  image?: string;
  total_regs: number;
  found: number;
  pct: number;
  jurisdictions: number;
}

export interface ProductJurisdiction {
  code: string;
  name: string;
  region: string;
  flag: string;
  total: number;
  found: number;
  pct: number;
}

export interface ProductRegulation {
  regulation_name: string;
  regulation_ref: string;
  jurisdiction_code: string;
  jurisdiction_name: string;
  category: string;
  enforcement_body: string;
  criticality: string;
  in_api: boolean;
  url: string;
}

export interface ProductTotals {
  product_regs_audited: number;
  product_regs_in_api: number;
  product_coverage_pct: number;
  product_categories: number;
  jurisdictions_audited: number;
  platform_regulations: number;
  platform_documents: number;
  platform_sources: number;
  platform_product_regs: number;
  platform_products_tracked: number;
}

export interface ProductComplianceData {
  totals: ProductTotals;
  categories: ProductCategory[];
  jurisdictions: ProductJurisdiction[];
  regulations: ProductRegulation[];
}

let cache: ProductComplianceData | null = null;

export function loadProductComplianceData(): ProductComplianceData {
  if (cache) return cache;
  const file = path.join(process.cwd(), "public", "data", "product-compliance.json");
  cache = JSON.parse(fs.readFileSync(file, "utf8")) as ProductComplianceData;
  return cache;
}

let familiesCache: ProductComplianceData | null = null;

/**
 * 15 broad physical-product families (rolled up from the 20 specific products)
 * powering the "Légal API produit physique" page.
 */
export function loadProductFamiliesData(): ProductComplianceData {
  if (familiesCache) return familiesCache;
  const file = path.join(process.cwd(), "public", "data", "product-families.json");
  familiesCache = JSON.parse(
    fs.readFileSync(file, "utf8"),
  ) as ProductComplianceData;
  return familiesCache;
}
