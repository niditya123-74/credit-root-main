import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Gauge, BarChart3, Building2, User } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { to: "/score", label: "Score", Icon: Gauge },
  { to: "/insights", label: "Insights", Icon: BarChart3 },
  { to: "/lenders", label: "Lenders", Icon: Building2 },
  { to: "/settings", label: "Profile", Icon: User },
];

export function MobileBottomNav() {
  const loc = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-2 py-1.5">
        {items.map(({ to, label, Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
