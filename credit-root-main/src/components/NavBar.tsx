import { Link, useLocation } from "@tanstack/react-router";
import { Bell, Menu, X, FlaskConical } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/score", label: "My Score" },
  { to: "/insights", label: "Insights" },
  { to: "/lenders", label: "Lenders" },
  { to: "/improve", label: "Improve" },
];

export function NavBar() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const profile = useAppStore((s) => s.profile);
  const initials = (profile.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = loc.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Link to="/demo" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <FlaskConical className="h-4 w-4" /> Demo
            </Button>
          </Link>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber" />
          </Button>
          <ThemeToggle />
          <Link to="/settings" aria-label="Profile">
            <Avatar className="ml-1 h-9 w-9 cursor-pointer ring-2 ring-transparent transition hover:ring-primary/30">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 text-sm font-medium ${
                  loc.pathname === l.to ? "bg-secondary text-primary" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/demo"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground"
            >
              Demo Panel
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground"
            >
              Settings
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
