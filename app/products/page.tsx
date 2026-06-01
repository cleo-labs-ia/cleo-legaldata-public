import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";

export const dynamic = "force-static";

export const metadata = {
  title: "Atlas Produit | Cleo Legal Data",
  description:
    "Atlas Produit — Specialized for product compliance. 46,031 product regulations across 20 categories. Cosmetics, electronics, toys, medical devices, food, textile, pharma, automotive, vaping…",
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return <ProductDashboard data={data} />;
}
