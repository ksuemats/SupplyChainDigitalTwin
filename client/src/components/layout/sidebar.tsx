import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  Network,
  Settings
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    title: "Supply Chain",
    href: "/supply-chain",
    icon: Network
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings
  }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen border-r">
      <div className="flex w-60 flex-col">
        <div className="border-b p-6">
          <h2 className="font-semibold">Digital Twin Platform</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
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
        </ScrollArea>
      </div>
    </div>
  );
}
