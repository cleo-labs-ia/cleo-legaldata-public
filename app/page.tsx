import HomeChooser from "./components/HomeChooser";
import { NUMBERS, fmt } from "@/lib/numbers";

export const dynamic = "force-static";

export const metadata = {
  title: "Cleo Legal Data — One API · Two coverages",
  description: `A REST API + MCP connector to query ${fmt(NUMBERS.productRegsPlatform, "en")} product regulations and ${fmt(NUMBERS.legalRegulations, "en")} legal regulations across ${NUMBERS.legalJurisdictions} jurisdictions. From your product, your monitoring pipelines, or your AI agents.`,
};

export default function Page() {
  return <HomeChooser />;
}
