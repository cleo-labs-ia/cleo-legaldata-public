import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";

export const dynamic = "force-static";

export const metadata = {
  title: "Atlas Produit | Cleo Legal Data",
  description:
    "Atlas Produit — Specialized for product compliance. 25,892 product regulations audited across 20 categories and 289 jurisdictions worldwide. Cosmetics, electronics, toys, medical devices, food, textile, pharma, automotive, vaping…",
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return <ProductDashboard data={data} />;
}
