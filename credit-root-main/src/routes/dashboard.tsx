import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Plug,
  Flame,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore, useScore } from "@/store/useAppStore";
import { SIGNAL_LABELS, getBand, type SignalKey } from "@/lib/score";
import { LENDERS } from "@/lib/lenders";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CreditRoot" },
      { name: "description", content: "Your CreditRoot score, behavior insights and loan offers in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const score = useScore();
  const profile = useAppStore((s) => s.profile);
  const sources = useAppStore((s) => s.sources);
  const signals = useAppStore((s) => s.signals);
  const history = useAppStore((s) => s.scoreHistory);
  const activity = useAppStore((s) => s.activity);
  const [range, setRange] = useState<"3M" | "6M" | "1Y">("1Y");

  const filtered = useMemo(() => {
    const n = range === "3M" ? 3 : range === "6M" ? 6 : 12;
    return history.slice(-n);
  }, [history, range]);

  const lastChange = history.length >= 2 ? history[history.length - 1].score - history[history.length - 2].score : 0;
  const connectedCount = Object.values(sources).filter(Boolean).length;
  const percentile = Math.min(99, Math.max(5, Math.round(((score - 300) / 550) * 100)));
  const offersCount = LENDERS.filter((l) => l.minScore <= score).length;
  const greeting = getGreeting();
  const firstName = profile.name?.split(" ")[0] || "there";

  return (
    <AppShell>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })} · You're
          looking{" "}
          <span className="font-semibold" style={{ color: getBand(score).color }}>
            {getBand(score).label.toLowerCase()}
          </span>{" "}
          this month.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score hero */}
        <Card className="lg:col-span-2 border-2 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <ScoreGauge score={score} size={240} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your CreditRoot Score
              </div>
              <div className="mt-1 flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    lastChange >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {lastChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {lastChange >= 0 ? "+" : ""}
                  {lastChange} pts this month
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                You're in the <strong className="text-foreground">{getBand(score).label}</strong> band — better
                than {percentile}% of CreditRoot users.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/score">
                  <Button size="sm" className="bg-gradient-brand text-primary-foreground">
                    See full breakdown <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link to="/improve">
                  <Button size="sm" variant="outline">
                    Improve my score
                  </Button>
                </Link>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Last updated {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <StatCard label="Percentile" value={`Top ${100 - percentile}%`} Icon={TrendingUp} />
          <StatCard label="Sources connected" value={`${connectedCount}/5`} Icon={Plug} />
          <StatCard label="Payment streak" value={`${Math.round((signals.rent / 100) * 12)} months`} Icon={Flame} />
          <StatCard label="Loan offers" value={`${offersCount} ready`} Icon={Building2} />
        </div>
      </div>

      {/* Score history */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Score history</h3>
            <div className="flex rounded-lg border bg-muted/40 p-0.5">
              {(["3M", "6M", "1Y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                    range === r ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={filtered} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="score-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[300, 850]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2.5} fill="url(#score-fill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Behavior breakdown */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Behavior breakdown</h3>
            <p className="text-sm text-muted-foreground">What's driving your score</p>
            <div className="mt-4 space-y-4">
              {(Object.keys(signals) as SignalKey[]).map((k) => {
                const v = Math.round(signals[k]);
                const band = getBandFromPct(v);
                return (
                  <div key={k}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{SIGNAL_LABELS[k]}</span>
                      <span className="tabular text-muted-foreground">
                        {v}% · <span style={{ color: band.color }}>{band.label}</span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${v}%`, backgroundColor: band.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Recent activity</h3>
            <p className="text-sm text-muted-foreground">Your last few financial moves</p>
            <ul className="mt-4 space-y-3">
              {activity.slice(0, 6).map((a) => {
                const Icon = a.type === "good" ? CheckCircle2 : a.type === "bad" ? AlertTriangle : Lightbulb;
                const color =
                  a.type === "good" ? "text-success" : a.type === "bad" ? "text-destructive" : "text-amber";
                return (
                  <li key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                    <div className="flex-1">
                      <div className="text-sm">{a.text}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(a.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <span
                      className={`tabular text-sm font-semibold ${
                        a.delta >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {a.delta >= 0 ? "+" : ""}
                      {a.delta}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Loan offers teaser */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Loan offers for you</h3>
              <p className="text-sm text-muted-foreground">{offersCount} lenders ready to say yes</p>
            </div>
            <Link to="/lenders">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {LENDERS.filter((l) => l.minScore <= score).slice(0, 3).map((l) => (
              <div key={l.id} className="rounded-xl border p-4 transition hover:shadow-elevate">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-lg text-sm font-bold text-primary-foreground"
                    style={{ background: l.color }}
                  >
                    {l.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.type}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-1 text-sm">
                  <span className="tabular font-semibold">₹{(l.amountMax / 1000).toFixed(0)}K</span>
                  <span className="text-xs text-muted-foreground">max</span>
                  <span className="ml-auto tabular text-xs">{l.rateMin}–{l.rateMax}% p.a.</span>
                </div>
                <Link to="/lenders" className="mt-3 block">
                  <Button size="sm" variant="outline" className="w-full">
                    Apply
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="mt-6 border-2 border-amber/30 bg-amber/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 text-amber" />
            <div className="flex-1">
              <h3 className="font-semibold">Quick wins for your score</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  "Pay your electricity bill 2 days early to gain +8 pts",
                  "Connect UPI to unlock +15 score points",
                  "Add 5 more UPI transactions this week (+3 pts)",
                ].map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 rounded-lg bg-background/60 p-3 text-sm"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({ label, value, Icon }: { label: string; value: string; Icon: typeof TrendingUp }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">{label}</div>
          <div className="truncate text-base font-bold tabular">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getBandFromPct(p: number) {
  if (p < 40) return { label: "Poor", color: "var(--score-poor)" };
  if (p < 60) return { label: "Fair", color: "var(--score-fair)" };
  if (p < 75) return { label: "Good", color: "var(--score-good)" };
  if (p < 88) return { label: "Very Good", color: "var(--score-vgood)" };
  return { label: "Excellent", color: "var(--score-excellent)" };
}
