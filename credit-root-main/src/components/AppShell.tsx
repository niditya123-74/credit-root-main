import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 md:pb-10">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
