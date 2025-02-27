import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function DashboardMetrics() {
  const { data: nodes = [] } = useQuery({
    queryKey: ["/api/nodes"]
  });

  const { data: riskAnalyses = [] } = useQuery({
    queryKey: ["/api/risk-analysis"]
  });

  const nodeTypes = nodes.reduce((acc: Record<string, number>, node: any) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  const averageRiskScore = riskAnalyses.length
    ? riskAnalyses.reduce((sum: number, analysis: any) => sum + analysis.riskScore, 0) / riskAnalyses.length
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nodes.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRiskScore.toFixed(1)}</div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Risk Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={riskAnalyses}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
