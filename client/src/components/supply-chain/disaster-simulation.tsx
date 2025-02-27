import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DisasterSimulationProps {
  nodeId: number;
}

export function DisasterSimulation({ nodeId }: DisasterSimulationProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<string>("Natural Disaster");
  const [selectedRegion, setSelectedRegion] = useState<string>("North America");
  const [selectedDuration, setSelectedDuration] = useState<string>("1-7 days");
  const [magnitude, setMagnitude] = useState<number>(50);
  const queryClient = useQueryClient();

  const simulationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST", 
        `/api/nodes/${nodeId}/simulate-disaster`,
        { 
          disasterType: selectedDisaster,
          region: selectedRegion,
          duration: selectedDuration,
          magnitude: magnitude
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nodes"] });
    }
  });

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Simulation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type of Disaster</label>
          <Select value={selectedDisaster} onValueChange={setSelectedDisaster}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Impact Region</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="North America">North America</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Magnitude</label>
          <div className="space-y-3">
            <Slider
              value={[magnitude]}
              onValueChange={(values) => setMagnitude(values[0])}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration</label>
          <Select value={selectedDuration} onValueChange={setSelectedDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-7 days">1-7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-orange-900">Predicted Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Supply Chain Disruption:</span>
                <span className="font-medium text-orange-900">78%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Revenue Impact:</span>
                <span className="font-medium text-orange-900">-45%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Recovery Time:</span>
                <span className="font-medium text-orange-900">3-4 months</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">AI Mitigation Strategies</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2 items-start">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <span>Establish backup suppliers in safe zones</span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <span>Reroute through alternative logistics hubs</span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                <span>Increase buffer inventory by 25%</span>
              </li>
            </ul>
          </div>
        </div>

        <Button 
          className="w-full bg-primary font-medium"
          disabled={simulationMutation.isPending}
          onClick={() => simulationMutation.mutate()}
        >
          Run Simulation
        </Button>
      </CardContent>
    </Card>
  );
}