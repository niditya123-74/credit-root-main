import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { SIGNAL_LABELS, type SignalKey } from "@/lib/score";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Behavior Insights — CreditRoot" },
      { name: "description", content: "Deep dives into your financial signals, monthly heatmap and spending patterns." },
    ],
  }),
  component: Insights,
});

function Insights() {
  const signals = useAppStore((s) => s.signals);

  // Generate 365-day mock heatmap
  const days = Array.from({ length: 365 }, (_, i) => {
    const r = Math.sin(i * 0.7) + Math.cos(i * 0.13);
    let val = 0;
    if (r > 0.5) val = 3;
    else if (r > 0) val = 2;
    else if (r > -0.5) val = 1;
    if (i % 17 === 0) val = -1; // late
    return val;
  });

  const spending = [
    { name: "Food", value: 4200, color: "var(--primary)" },
    { name: "Transport", value: 1800, color: "var(--amber)" },
    { name: "Utilities", value: 2400, color: "var(--chart-3)" },
    { name: "Entertainment", value: 1100, color: "var(--chart-4)" },
    { name: "Other", value: 900, color: "var(--chart-5)" },
  ];
  const totalSpend = spending.reduce((s, x) => s + x.value, 0);

  const drivers = [
    { good: true, text: "Consistent rent payment for 11 months" },
    { good: true, text: "Regular monthly mobile recharge" },
    { good: true, text: "Utility bills paid on time 5/6 months" },
    { good: false, text: "Low UPI transaction volume" },
    { good: false, text: "Employment data not verified" },
  ];

  return (
    <AppShell>
      <h1 className="text-2xl font-bold sm:text-3xl">Behavior Insights</h1>
      <p className="text-sm text-muted-foreground">A microscope on your financial habits.</p>

      {/* Heatmap */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Activity heatmap (last 12 months)</h3>
          <p className="text-sm text-muted-foreground">Each cell is a day. Greener = more positive activity.</p>
          <div className="mt-5 overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ width: "max-content" }}>
              {days.map((v, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-[3px]"
                  style={{ backgroundColor: heatColor(v) }}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            Less
            {[0, 1, 2, 3].map((v) => (
              <span key={v} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: heatColor(v) }} />
            ))}
            More
            <span className="ml-3 inline-flex items-center gap-1">
              <span className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: heatColor(-1) }} />
              Late/missed
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Signal deep-dives</h3>
          <Tabs defaultValue="utility" className="mt-4">
            <TabsList className="flex w-full flex-wrap">
              {(Object.keys(signals) as SignalKey[]).map((k) => (
                <TabsTrigger key={k} value={k} className="flex-1">
                  {SIGNAL_LABELS[k]}
                </TabsTrigger>
              ))}
            </TabsList>
            {(Object.keys(signals) as SignalKey[]).map((k) => {
              const v = Math.round(signals[k]);
              const trend = v > 70 ? "improving" : v > 50 ? "stable" : "declining";
              const TrendIcon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Minus;
              const trendColor =
                trend === "improving" ? "text-success" : trend === "declining" ? "text-destructive" : "text-muted-foreground";
              const data = Array.from({ length: 12 }, (_, i) => ({
                m: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i],
                val: Math.max(20, Math.min(100, v + Math.round(Math.sin(i * 0.6) * 15))),
              }));
              return (
                <TabsContent key={k} value={k} className="mt-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1 rounded-xl border p-5">
                      <div className="text-xs uppercase text-muted-foreground">Score contribution</div>
                      <div className="mt-2 text-5xl font-bold tabular text-gradient-brand">{v}%</div>
                      <span
                        className={`mt-3 inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold ${trendColor}`}
                      >
                        <TrendIcon className="h-3 w-3" /> {trend}
                      </span>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {recommendation(k, v)}
                      </p>
                    </div>
                    <div className="h-56 lg:col-span-2">
                      <ResponsiveContainer>
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
                          <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--popover)",
                              border: "1px solid var(--border)",
                              borderRadius: 8,
                            }}
                          />
                          <Bar dataKey="val" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Spending donut */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">UPI spending breakdown</h3>
            <p className="text-sm text-muted-foreground">Total this month: ₹{totalSpend.toLocaleString("en-IN")}</p>
            <div className="mt-3 h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={spending}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {spending.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {spending.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="flex-1">{s.name}</span>
                  <span className="tabular text-muted-foreground">₹{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Drivers */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">What's helping vs hurting</h3>
            <ul className="mt-4 space-y-2.5">
              {drivers.map((d, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    d.good ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                      d.good ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    {d.good ? "+" : "−"}
                  </span>
                  <span className="text-sm">{d.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function heatColor(v: number) {
  if (v === -1) return "color-mix(in oklab, var(--destructive) 70%, transparent)";
  if (v === 0) return "var(--muted)";
  if (v === 1) return "color-mix(in oklab, var(--primary) 30%, transparent)";
  if (v === 2) return "color-mix(in oklab, var(--primary) 60%, transparent)";
  return "var(--primary)";
}

function recommendation(k: SignalKey, v: number) {
  if (v > 80) return `Excellent ${SIGNAL_LABELS[k].toLowerCase()} pattern. Keep it up.`;
  if (v > 60) return `Solid signal — try staying just as consistent for 3 more months to push into the next band.`;
  return `This is your biggest opportunity. Improving ${SIGNAL_LABELS[k].toLowerCase()} could lift your score by 30–60 pts.`;
}
