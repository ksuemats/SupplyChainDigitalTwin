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

const DISASTER_TYPES = {
  weather: "Natural Disaster",
  supplier: "Critical Supplier Failure",
  geopolitical: "Geopolitical Crisis",
  logistics: "Logistics Disruption",
  cyber: "Cybersecurity Incident",
  financial: "Financial Crisis",
  pandemic: "Health Crisis/Pandemic",
  regulatory: "Regulatory Changes"
} as const;

const IMPACT_REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Asia Pacific",
  "Middle East",
  "Africa",
  "Global"
];

const DURATION_OPTIONS = [
  "1-7 days",
  "1-4 weeks",
  "1-6 months",
  "6-12 months"
];

interface DisasterSimulationProps {
  nodeId: number;
}

export function DisasterSimulation({ nodeId }: DisasterSimulationProps) {
  const [selectedDisaster, setSelectedDisaster] = useState<string>();
  const [selectedRegion, setSelectedRegion] = useState<string>("Global");
  const [selectedDuration, setSelectedDuration] = useState<string>("1-7 days");
  const [magnitude, setMagnitude] = useState<number>(50);
  const queryClient = useQueryClient();

  const simulationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDisaster) return;
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Disaster Scenario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type of Disaster</label>
          <Select onValueChange={setSelectedDisaster}>
            <SelectTrigger>
              <SelectValue placeholder="Select disaster type" />
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Impact Region</label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMPACT_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
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
              {DURATION_OPTIONS.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration}
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
          <div className="space-y-4 pt-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Supply Chain Disruption: {simulationMutation.data.impact}
              </AlertDescription>
            </Alert>

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