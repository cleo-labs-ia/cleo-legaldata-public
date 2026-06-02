import ProductDashboard from "../products/ProductDashboard";
import { loadProductFamiliesData } from "@/lib/product-data";

export const dynamic = "force-static";

export const metadata = {
  title: "Légal API produit physique | Cleo Legal Data",
  description:
    "Une API légale pour chaque produit physique. 15 grandes familles — cosmétiques, électronique, jouets, dispositifs médicaux, automobile, drones, tabac… Cliquez une catégorie pour voir toutes les réglementations applicables pays par pays.",
};

export default function LegalApiPage() {
  const data = loadProductFamiliesData();
  return <ProductDashboard data={data} variant="legal-api" />;
}
