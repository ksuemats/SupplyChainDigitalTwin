import { Handle, Position } from "reactflow";
import { NODE_TYPES } from "@/lib/supply-chain";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const baseNodeStyle = "p-4 min-w-[200px] rounded-lg border-2 shadow-lg";
const handleStyle = "w-3 h-3 bg-primary border-2 border-background";

// Production nodes
export function SupplierNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-blue-500")}>
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.supplier}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.location}</p>
      </div>
    </Card>
  );
}

export function ManufacturerNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-green-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.manufacturer}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.capacity}</p>
      </div>
    </Card>
  );
}

export function ProcessorNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-emerald-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.processor}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.capacity}</p>
      </div>
    </Card>
  );
}

// Storage & Distribution nodes
export function WarehouseNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-amber-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.warehouse}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.capacity}</p>
      </div>
    </Card>
  );
}

export function DistributorNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-purple-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.distributor}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.region}</p>
      </div>
    </Card>
  );
}

export function CrossDockNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-indigo-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.crossdock}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.capacity}</p>
      </div>
    </Card>
  );
}

// Sales & Delivery nodes
export function RetailerNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-orange-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.retailer}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.market}</p>
      </div>
    </Card>
  );
}

export function WholesalerNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-rose-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.wholesaler}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.market}</p>
      </div>
    </Card>
  );
}

export function LastMileNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-pink-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.lastmile}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.region}</p>
      </div>
    </Card>
  );
}

// Special Facility nodes
export function ColdChainNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-cyan-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.coldchain}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.temperature}</p>
      </div>
    </Card>
  );
}

export function CustomsNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-slate-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.customs}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.region}</p>
      </div>
    </Card>
  );
}

export function QualityControlNode({ data }: { data: any }) {
  return (
    <Card className={cn(baseNodeStyle, "border-teal-500")}>
      <Handle type="target" position={Position.Left} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">{NODE_TYPES.quality}</Badge>
        <h3 className="font-semibold">{data.name}</h3>
        <p className="text-sm text-muted-foreground">{data.standards}</p>
      </div>
    </Card>
  );
}

export const nodeTypes = {
  supplier: SupplierNode,
  manufacturer: ManufacturerNode,
  processor: ProcessorNode,
  warehouse: WarehouseNode,
  distributor: DistributorNode,
  crossdock: CrossDockNode,
  retailer: RetailerNode,
  wholesaler: WholesalerNode,
  lastmile: LastMileNode,
  coldchain: ColdChainNode,
  customs: CustomsNode,
  quality: QualityControlNode
};