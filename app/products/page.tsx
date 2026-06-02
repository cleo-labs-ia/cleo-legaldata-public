import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";
import { NUMBERS, fmt } from "@/lib/numbers";

export const dynamic = "force-static";

export const metadata = {
  title: "Legal Product Physical Atlas | Cleo Legal Data",
  description: `Specialised for physical-product compliance: ${fmt(NUMBERS.productRegsPlatform, "en")} product regulations across ${NUMBERS.productCategories} categories and ${NUMBERS.productJurisdictions} jurisdictions. Cosmetics, electronics, toys, medical devices, food, textile, pharma, automotive, vaping…`,
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return <ProductDashboard data={data} />;
}
