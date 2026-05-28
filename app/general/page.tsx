import Dashboard from "../components/Dashboard";
import { loadDashboardData } from "@/lib/data";

export const dynamic = "force-static";

export const metadata = {
  title: "Legal Data Atlas | Cleo",
  description:
    "1,479 official legal sources across 177 jurisdictions. Machine-readable.",
};

export default function GeneralPage() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
