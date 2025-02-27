import { SupplyChainEditor } from "@/components/supply-chain/flow-editor";
import { RiskAnalysis } from "@/components/supply-chain/risk-analysis";
import { DisasterSimulation } from "@/components/supply-chain/disaster-simulation";
import { useState } from "react";

export default function SupplyChain() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  return (
    <div className="h-screen w-full overflow-hidden bg-background/95">
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-2xl font-semibold text-foreground">Supply Chain Model</h1>
      </div>

      <div className="grid grid-cols-[240px_1fr_280px] h-[calc(100vh-4rem)]">
        <div className="border-r border-border/50 px-4">
          {/* Sidebar content is handled by the layout component */}
        </div>

        <div className="h-full w-full relative">
          <SupplyChainEditor onNodeSelect={setSelectedNode} />
        </div>

        <div className="border-l border-border/50 px-4 overflow-y-auto">
          <div className="space-y-4 py-4">
            <DisasterSimulation />
            {selectedNode && <RiskAnalysis nodeId={selectedNode} />}
          </div>
        </div>
      </div>
    </div>
  );
}