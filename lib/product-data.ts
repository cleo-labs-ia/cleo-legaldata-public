import fs from "node:fs";
import path from "node:path";

export interface ProductCategory {
  name: string;
  description: string;
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

export interface ProductComplianceData {
  totals: {
    regulations: number;
    authorities: number;
    countries: number;
    products_tracked: number;
    legal_documents: number;
    sources: number;
    categories: number;
    coverage_pct: number;
  };
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
