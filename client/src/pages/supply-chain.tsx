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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 min-h-[calc(100vh-10rem)]">
          <SupplyChainEditor onNodeSelect={setSelectedNode} />
        </div>
        <div className="space-y-6">
          {selectedNode && (
            <>
              <RiskAnalysis nodeId={selectedNode} />
              <DisasterSimulation nodeId={selectedNode} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}