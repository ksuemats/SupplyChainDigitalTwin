import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const DISASTER_TYPES = {
  weather: "Extreme Weather Event",
  supplier: "Critical Supplier Failure",
  geopolitical: "Geopolitical Crisis",
  logistics: "Logistics Disruption",
  cyber: "Cybersecurity Incident"
} as const;

interface DisasterSimulationProps {
  nodeId: number;
}

export function DisasterSimulation({ nodeId }: DisasterSimulationProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<string>();
  const queryClient = useQueryClient();

  const simulationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDisaster) return;
      const res = await apiRequest(
        "POST", 
        `/api/nodes/${nodeId}/simulate-disaster`,
        { disasterType: selectedDisaster }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
    }
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Disaster Impact Simulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Disaster Scenario</label>
          <Select onValueChange={setSelectedDisaster}>
            <SelectTrigger>
              <SelectValue placeholder="Select a disaster scenario" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DISASTER_TYPES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full"
          disabled={!selectedDisaster || simulationMutation.isPending}
          onClick={() => simulationMutation.mutate()}
        >
          Run Simulation
        </Button>

        {simulationMutation.data && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Impact Analysis</h4>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {simulationMutation.data.impact}
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Alternative Routes</h4>
              <ul className="list-disc pl-4 space-y-1">
                {simulationMutation.data.alternatives.map((alt: string, i: number) => (
                  <li key={i} className="text-sm">{alt}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
              <ul className="list-disc pl-4 space-y-1">
                {simulationMutation.data.mitigations.map((strategy: string, i: number) => (
                  <li key={i} className="text-sm">{strategy}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}