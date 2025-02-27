import { SupplyChainEditor } from "@/components/supply-chain/flow-editor";
import { RiskAnalysis } from "@/components/supply-chain/risk-analysis";
import { DisasterSimulation } from "@/components/supply-chain/disaster-simulation";
import { useState } from "react";

export default function SupplyChain() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="h-[100vh] overflow-hidden bg-background/95">
      <div className="flex items-center justify-between p-6 pb-2">
        <h1 className="text-2xl font-semibold text-foreground">Supply Chain Model</h1>
      </div>

      <div className="grid grid-cols-[240px_1fr_280px] gap-4 h-[calc(100vh-4rem)] p-4">
        <div className="border-r border-border/50 pr-4">
          {/* Sidebar content is handled by the layout component */}
        </div>

        <div className="h-full min-h-[600px] relative">
          <SupplyChainEditor onNodeSelect={setSelectedNode} />
        </div>

        <div className="space-y-4 border-l border-border/50 pl-4 overflow-y-auto">
          <DisasterSimulation />
          {selectedNode && <RiskAnalysis nodeId={selectedNode} />}
        </div>
      </div>
    </div>
  );
}