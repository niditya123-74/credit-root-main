import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Your roots. Your score. Your future. CreditRoot scores you on what truly matters — your
              real financial behavior.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">How it works</Link></li>
              <li><Link to="/lenders" className="hover:text-foreground">For Lenders</Link></li>
              <li><Link to="/demo" className="hover:text-foreground">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground" href="#">About</a></li>
              <li><a className="hover:text-foreground" href="#">Privacy</a></li>
              <li><a className="hover:text-foreground" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CreditRoot. Built for the financially invisible.
        </div>
      </div>
    </footer>
  );
}
