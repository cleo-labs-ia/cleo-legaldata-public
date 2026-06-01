import Dashboard from "./components/Dashboard";
import { loadDashboardData } from "@/lib/data";

export const dynamic = "force-static";

export const metadata = {
  title: "Cleo Legal Data Atlas",
  description:
    "Public map of open legal data sources tracked by Cleo Comply — 1,494 official portals, 177 jurisdictions, 234M+ legal documents.",
};

export default function Page() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
