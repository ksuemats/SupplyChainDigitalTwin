import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateNodeRiskColor } from "@/lib/supply-chain";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RiskAnalysisProps {
  nodeId: number;
}

export function RiskAnalysis({ nodeId }: RiskAnalysisProps) {
  const queryClient = useQueryClient();

  const { data: analysis } = useQuery({
    queryKey: ["/api/risk-analysis", nodeId],
    enabled: !!nodeId
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/risk-analysis/${nodeId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risk-analysis", nodeId] });
    }
  });

  const latestAnalysis = analysis?.[0]?.analysisData;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Risk Analysis</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => analyzeMutation.mutate()}
          disabled={analyzeMutation.isPending}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {latestAnalysis ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Risk Score</span>
                <span>{latestAnalysis.riskScore}%</span>
              </div>
              <Progress
                value={latestAnalysis.riskScore}
                className={calculateNodeRiskColor(latestAnalysis.riskScore)}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Risk Factors</h4>
              <div className="space-y-2">
                {latestAnalysis.factors.map((factor, i) => (
                  <div key={i} className="border rounded p-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{factor.category}</span>
                      <span>Impact: {factor.impact}/10</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="list-disc pl-4 space-y-1">
                {latestAnalysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No analysis available. Click refresh to analyze risks.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
