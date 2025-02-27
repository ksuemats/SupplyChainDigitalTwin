import { DashboardMetrics } from "@/components/dashboard/metrics";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <DashboardMetrics />
    </div>
  );
}
