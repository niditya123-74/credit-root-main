import { Sprout } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold text-lg ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-brand">
        <Sprout className="h-4 w-4" />
      </span>
      <span className="tracking-tight">
        Credit<span className="text-primary">Root</span>
      </span>
    </span>
  );
}
