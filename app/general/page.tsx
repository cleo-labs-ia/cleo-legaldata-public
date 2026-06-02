import Dashboard from "../components/Dashboard";
import { loadDashboardData } from "@/lib/data";
import { NUMBERS, fmt } from "@/lib/numbers";

export const dynamic = "force-static";

export const metadata = {
  title: "Legal Atlas | Cleo Legal Data",
  description: `${fmt(NUMBERS.legalSources, "en")} official sources across ${NUMBERS.legalJurisdictions} jurisdictions, ${fmt(NUMBERS.legalRegulations, "en")} regulations indexed. ${NUMBERS.sourcesComplete} fully indexed, ${NUMBERS.sourcesBlocked} in progress, ${NUMBERS.sourcesPlanned} planned — machine-readable.`,
};

export default function GeneralPage() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
