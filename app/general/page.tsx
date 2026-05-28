import Dashboard from "../components/Dashboard";
import { loadDashboardData } from "@/lib/data";

export const dynamic = "force-static";

export const metadata = {
  title: "Atlas | Cleo Legal Data",
  description:
    "The world's complete legal data atlas. 210,508 regulations across 177 jurisdictions — all topics, machine-readable.",
};

export default function GeneralPage() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
