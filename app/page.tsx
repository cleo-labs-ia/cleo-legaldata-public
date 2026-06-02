import HomeChooser from "./components/HomeChooser";

export const dynamic = "force-static";

export const metadata = {
  title: "Cleo Legal Data — One API · Two coverages",
  description:
    "A REST API + MCP connector to query 46,031 product regulations and 210,508 legal regulations across 177 jurisdictions. From your product, your monitoring pipelines, or your AI agents.",
};

export default function Page() {
  return <HomeChooser />;
}
