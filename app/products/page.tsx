import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";

export const dynamic = "force-static";

export const metadata = {
  title: "Product Compliance Atlas | Cleo Legal Data",
  description:
    "Every product regulation worldwide, machine-readable. 15 industries, 50+ countries, 209,000+ regulations tracked.",
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return <ProductDashboard data={data} />;
}
