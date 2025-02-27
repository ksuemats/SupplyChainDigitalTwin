import { SupplyChainEditor } from "@/components/supply-chain/flow-editor";
import { RiskAnalysis } from "@/components/supply-chain/risk-analysis";
import { DisasterSimulation } from "@/components/supply-chain/disaster-simulation";
import { useState } from "react";

export default function SupplyChain() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="h-screen overflow-hidden bg-background/95 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Supply Chain Model</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6 h-[calc(100vh-8rem)]">
        <div className="border-r border-border/50 pr-6">
          {/* Sidebar content is handled by the layout component */}
        </div>

        <div className="min-h-[600px]">
          <SupplyChainEditor onNodeSelect={setSelectedNode} />
        </div>

        <div className="space-y-6">
          <DisasterSimulation nodeId={selectedNode || 0} />
          {selectedNode && <RiskAnalysis nodeId={selectedNode} />}
        </div>
      </div>
    </div>
  );
}