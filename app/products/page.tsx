import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";

export const dynamic = "force-static";

export const metadata = {
  title: "Product Compliance API | Cleo Legal Data",
  description:
    "The world's largest product compliance database. 46,000+ product regulations, 152 official sources, 15 categories. Check any product against any country in one API call.",
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return <ProductDashboard data={data} />;
}
