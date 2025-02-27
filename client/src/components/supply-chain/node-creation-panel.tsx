import { Button } from "@/components/ui/button";
import { NODE_TYPES } from "@/lib/supply-chain";
import { Factory, Truck, Store, Box } from "lucide-react";

interface NodeCreationPanelProps {
  onCreateNode: (type: string) => void;
}

const nodeButtons = [
  { type: 'supplier', label: NODE_TYPES.supplier, icon: Box },
  { type: 'manufacturer', label: NODE_TYPES.manufacturer, icon: Factory },
  { type: 'distributor', label: NODE_TYPES.distributor, icon: Truck },
  { type: 'retailer', label: NODE_TYPES.retailer, icon: Store },
];

export function NodeCreationPanel({ onCreateNode }: NodeCreationPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-10 bg-background rounded-lg border shadow-lg p-4">
      <h3 className="font-semibold mb-3">Add Node</h3>
      <div className="flex flex-col gap-2">
        {nodeButtons.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            className="justify-start gap-2"
            onClick={() => onCreateNode(type)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
