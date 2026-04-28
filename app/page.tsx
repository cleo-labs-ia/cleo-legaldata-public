import Dashboard from "./components/Dashboard";
import { loadDashboardData } from "@/lib/data";

export const dynamic = "force-static";

export default function Page() {
  const data = loadDashboardData();
  return <Dashboard data={data} />;
}
