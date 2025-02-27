import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Factory,
  Warehouse,
  Truck,
  Store,
  Settings,
  LineChart,
  Box,
  Building2,
  Building,
  ShoppingCart,
  Home,
  Thermometer,
  Scale,
  FileCheck,
  PackageCheck,
  Container
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LineChart
  },
  {
    title: "Supply Chain",
    href: "/supply-chain",
    icon: Factory
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

const supplyChainComponents = {
  production: [
    { title: "Raw Material Supplier", icon: Box, type: "supplier" },
    { title: "Manufacturing Plant", icon: Factory, type: "manufacturer" },
    { title: "Processing Facility", icon: PackageCheck, type: "processor" }
  ],
  storage: [
    { title: "Warehouse", icon: Warehouse, type: "warehouse" },
    { title: "Distribution Center", icon: Building2, type: "distributor" },
    { title: "Cross-Dock Facility", icon: Container, type: "crossdock" }
  ],
  sales: [
    { title: "Retail Store", icon: Store, type: "retailer" },
    { title: "Wholesale Center", icon: ShoppingCart, type: "wholesaler" },
    { title: "Last-Mile Hub", icon: Home, type: "lastmile" }
  ],
  specialized: [
    { title: "Cold Storage", icon: Thermometer, type: "coldchain" },
    { title: "Customs Facility", icon: Scale, type: "customs" },
    { title: "Quality Control", icon: FileCheck, type: "quality" }
  ]
};

export function Sidebar() {
  const [location] = useLocation();

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-screen border-r bg-card">
      <div className="flex w-64 flex-col">
        <div className="border-b p-6">
          <h2 className="font-semibold text-lg text-primary">SupplyTwin</h2>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={location === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      location === item.href && "bg-secondary"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>

            {location === "/supply-chain" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Supply Chain Components</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Drag and drop components to build your supply chain network
                  </p>
                </div>

                {(Object.entries(supplyChainComponents) as [keyof typeof supplyChainComponents, typeof supplyChainComponents[keyof typeof supplyChainComponents]][]).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium capitalize px-2">{category}</h4>
                    <div className="space-y-1">
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.type}
                            variant="ghost"
                            className="w-full justify-start gap-2 cursor-grab active:cursor-grabbing text-sm"
                            draggable
                            onDragStart={(e) => onDragStart(e, item.type)}
                          >
                            <Icon className="h-4 w-4" />
                            {item.title}
                          </Button>
                        );
                      })}
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}