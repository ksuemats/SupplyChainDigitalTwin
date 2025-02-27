import { SupplyChainEditor } from "@/components/supply-chain/flow-editor";
import { RiskAnalysis } from "@/components/supply-chain/risk-analysis";
import { DisasterSimulation } from "@/components/supply-chain/disaster-simulation";
import { useState } from "react";

export default function SupplyChain() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Supply Chain Model</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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