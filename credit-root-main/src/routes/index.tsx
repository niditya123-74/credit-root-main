import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  Wallet,
  Smartphone,
  Home,
  Briefcase,
  ArrowUpRight,
  Ban,
  HardHat,
  Hourglass,
  PlugZap,
  Gauge,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CreditRoot — Your roots. Your score. Your future." },
      {
        name: "description",
        content:
          "Build a fair 0–850 credit score from your real financial behavior — rent, utilities, mobile, UPI. Designed for the 1.4 billion credit-invisible.",
      },
      { property: "og:title", content: "CreditRoot — Score what truly matters" },
      {
        property: "og:description",
        content: "An alternative credit score for the credit-invisible. Real behavior, real access.",
      },
    ],
  }),
  component: Landing,
});

function useCountUp(target: number, duration = 1800, run = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, run]);
  return val;
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setRun(true);
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const v = useCountUp(to, 1800, run);
  return (
    <span ref={ref} className="tabular">
      {v.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#signals" className="hover:text-foreground">Data signals</a>
            <Link to="/lenders" className="hover:text-foreground">For lenders</Link>
            <Link to="/demo" className="hover:text-foreground">Demo</Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
                Get my score
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 root-pattern">
        <RootsBackground />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber" />
              An alternative credit score for the rest of us
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Your financial story{" "}
              <span className="text-gradient-brand">deserves to be heard.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 text-balance text-lg text-muted-foreground"
            >
              CreditRoot scores you on what actually matters — how you pay rent, bills, and recharge
              every month. Not just loan history.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link to="/signup">
                <Button size="lg" className="gap-2 bg-gradient-brand text-primary-foreground shadow-brand hover:opacity-95">
                  Get my free score <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline" className="gap-2">
                  See how it works
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col items-center"
            >
              <div className="text-5xl font-bold text-gradient-brand sm:text-6xl">
                <Counter to={1400000000} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                credit-invisible people worldwide. Time to bring them in.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-t bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            The Invisible Wall
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Billions of hard-working people are locked out of formal credit — not because they can't
            pay, but because no one is measuring how they already do.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { stat: "1.4B+", label: "People globally with no credit history", color: "var(--score-poor)" },
              { stat: "190M+", label: "Credit-invisible adults in India", color: "var(--amber)" },
              { stat: "0", label: "Score = no loans, no cards, no future", color: "var(--primary)" },
            ].map((c) => (
              <Card key={c.label} className="border-2 transition-shadow hover:shadow-elevate">
                <CardContent className="p-7 text-center">
                  <div className="text-5xl font-bold tabular" style={{ color: c.color }}>
                    {c.stat}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{c.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRADITIONAL FAILS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Why traditional systems fail</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            CIBIL and FICO ask one question: "Have you borrowed before?" If not, you don't exist.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { Icon: Ban, title: "Only rewards borrowers", body: "Savers and on-time bill payers are invisible." },
              { Icon: HardHat, title: "Excludes informal workers", body: "Gig, freelance, daily wage — no salary slip, no score." },
              { Icon: Hourglass, title: "No second chances", body: "One old missed EMI follows you for 7 years." },
            ].map(({ Icon, title, body }) => (
              <Card key={title} className="group transition hover:-translate-y-1 hover:shadow-elevate">
                <CardContent className="p-6">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-destructive/10 text-destructive">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-y bg-gradient-to-b from-card/40 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">How CreditRoot works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Three simple steps. No paperwork. No bank statements. No collateral.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { Icon: PlugZap, n: "1", title: "Connect your data", body: "Link utility bills, mobile, rent and UPI in seconds." },
              { Icon: Gauge, n: "2", title: "Get scored", body: "Our ML engine generates a fair 0–850 credit score." },
              { Icon: HandCoins, n: "3", title: "Access credit", body: "Get matched with lenders ready to say yes." },
            ].map(({ Icon, n, title, body }, i) => (
              <div key={title} className="relative">
                <Card className="h-full border-2 border-primary/10 bg-card transition hover:border-primary/30 hover:shadow-brand">
                  <CardContent className="p-7">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {n}
                      </span>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIGNALS */}
      <section id="signals" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">The data we listen to</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Five everyday signals tell us more about your financial reliability than any loan history.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { Icon: Zap, title: "Utility bills", body: "Electricity, water, gas — paid on time?" },
              { Icon: Smartphone, title: "Mobile recharge", body: "Prepaid top-up frequency & amount." },
              { Icon: Home, title: "Rent payments", body: "Monthly rent track record." },
              { Icon: Wallet, title: "UPI transactions", body: "Digital payment patterns." },
              { Icon: Briefcase, title: "Employment", body: "Income stability signals." },
            ].map(({ Icon, title, body }) => (
              <Card key={title} className="transition hover:-translate-y-1 hover:shadow-elevate">
                <CardContent className="p-5">
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-t bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Real people. Real scores.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya", city: "Jaipur", from: 0, to: 620, time: "3 months", quote: "I never had a bank loan. CreditRoot gave me a score from my electricity bills." },
              { name: "Ravi", city: "Bhopal", from: 0, to: 540, time: "2 months", quote: "Finally a system that understands freelance income isn't unstable income." },
              { name: "Meena", city: "Indore", from: 0, to: 480, time: "4 months", quote: "Got my first ever microloan after 12 years of paying rent on time." },
            ].map((t) => (
              <Card key={t.name} className="transition hover:shadow-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-primary-foreground font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.city}</div>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    Score {t.from} → {t.to} in {t.time}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 text-center shadow-brand sm:p-16">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-amber/30 blur-2xl" />
            <div className="relative">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary-foreground/90" />
              <h2 className="mt-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
                Ready to build your financial future?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
                Free, fast, and built for you. Get your first CreditRoot score in under 3 minutes.
              </p>
              <Link to="/signup">
                <Button size="lg" className="mt-7 gap-2 bg-amber text-amber-foreground hover:opacity-95">
                  Create free account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-primary-foreground/70">
                <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> No credit history required</span>
                <span className="inline-flex items-center gap-1.5"><Lightbulb className="h-3.5 w-3.5" /> Instant insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function RootsBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="root-line" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--amber)" />
        </linearGradient>
      </defs>
      {Array.from({ length: 18 }).map((_, i) => (
        <path
          key={i}
          d={`M ${50 + i * 65} 0 Q ${100 + i * 60} ${200 + (i % 3) * 80} ${50 + i * 70} 600`}
          stroke="url(#root-line)"
          strokeWidth="1"
          fill="none"
        />
      ))}
    </svg>
  );
}
