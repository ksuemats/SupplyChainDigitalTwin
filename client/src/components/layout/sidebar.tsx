import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Factory,
  Warehouse,
  Truck,
  Store,  
  Settings,
  LineChart
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

const supplyChainComponents = [
  {
    title: "Manufacturing Plant",
    icon: Factory,
    type: "manufacturer"
  },
  {
    title: "Warehouse",
    icon: Warehouse,
    type: "supplier"
  },
  {
    title: "Distribution Center",
    icon: Truck,
    type: "distributor"
  },
  {
    title: "Retail Location",
    icon: Store,
    type: "retailer"
  }
];

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
              <div className="space-y-2">
                <h3 className="text-sm font-medium px-2">Supply Chain Components</h3>
                {supplyChainComponents.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.type}
                      variant="ghost"
                      className="w-full justify-start gap-2 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => onDragStart(e, item.type)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}