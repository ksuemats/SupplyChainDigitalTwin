import { SupplyChainEditor } from "@/components/supply-chain/flow-editor";
import { RiskAnalysis } from "@/components/supply-chain/risk-analysis";
import { DisasterSimulation } from "@/components/supply-chain/disaster-simulation";
import { useState } from "react";

export default function SupplyChain() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background/95">
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-2xl font-semibold text-foreground">Supply Chain Model</h1>
      </div>

      <div className="flex-1 flex">
        <div className="w-60 border-r">
          {/* Sidebar content is handled by the layout component */}
        </div>

        <div className="flex-1 relative">
          <SupplyChainEditor onNodeSelect={setSelectedNode} />
        </div>

        <div className="w-72 border-l overflow-y-auto">
          <div className="p-4 space-y-4">
            <DisasterSimulation />
            {selectedNode && <RiskAnalysis nodeId={selectedNode} />}
          </div>
        </div>
      </div>
    </div>
  );
}