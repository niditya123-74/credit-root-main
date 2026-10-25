import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAppStore, useScore } from "@/store/useAppStore";
import { SCORE_BANDS, SIGNAL_LABELS, SIGNAL_WEIGHTS, computeScore, getBand, type SignalKey } from "@/lib/score";

export const Route = createFileRoute("/score")({
  head: () => ({
    meta: [
      { title: "My Score — CreditRoot" },
      { name: "description", content: "Detailed score breakdown, factor analysis and what-if simulator." },
    ],
  }),
  component: ScorePage,
});

function ScorePage() {
  const score = useScore();
  const signals = useAppStore((s) => s.signals);
  const history = useAppStore((s) => s.scoreHistory);
  const band = getBand(score);

  const pct = ((score - 300) / 550) * 100;

  const [whatIfs, setWhatIfs] = useState({ utility: 0, upi: 0, employment: 0 });
  const simulated = useMemo(() => {
    return computeScore({
      utility: Math.min(100, signals.utility + whatIfs.utility),
      mobile: signals.mobile,
      rent: signals.rent,
      upi: Math.min(100, signals.upi + whatIfs.upi),
      employment: Math.min(100, signals.employment + whatIfs.employment),
    });
  }, [signals, whatIfs]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold sm:text-3xl">My Score</h1>
      <p className="text-sm text-muted-foreground">A full breakdown of your CreditRoot score.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row">
            <ScoreGauge score={score} size={280} />
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your score
              </div>
              <div className="mt-2 text-5xl font-bold tabular text-gradient-brand">{score}</div>
              <div className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `color-mix(in oklab, ${band.color} 15%, transparent)`, color: band.color }}>
                {band.label} — {band.description}
              </div>

              <div className="mt-6">
                <div className="relative h-3 overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to right, var(--score-poor) 0%, var(--score-fair) 35%, var(--score-good) 55%, var(--score-vgood) 75%, var(--score-excellent) 100%)",
                    }}
                  />
                </div>
                <div className="relative">
                  <div
                    className="absolute -top-2 h-6 w-1 rounded-full bg-foreground shadow-md"
                    style={{ left: `calc(${pct}% - 2px)` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground tabular">
                  <span>300</span><span>500</span><span>600</span><span>700</span><span>850</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Score bands</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {SCORE_BANDS.map((b) => (
                <li
                  key={b.label}
                  className={`flex items-center justify-between rounded-lg p-2.5 ${
                    b.label === band.label ? "bg-secondary font-semibold" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    {b.label}
                  </span>
                  <span className="tabular text-muted-foreground">{b.min}–{b.max}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Factor table */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Factor analysis</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">Factor</th>
                  <th className="py-2 pr-4 font-semibold">Weight</th>
                  <th className="py-2 pr-4 font-semibold">Your %</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(signals) as SignalKey[]).map((k) => {
                  const v = Math.round(signals[k]);
                  const w = SIGNAL_WEIGHTS[k];
                  const status = bandFromPct(v);
                  const impact = Math.round(v * w * 5.5);
                  return (
                    <tr key={k} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{SIGNAL_LABELS[k]}</td>
                      <td className="py-3 pr-4 tabular text-muted-foreground">{Math.round(w * 100)}%</td>
                      <td className="py-3 pr-4 tabular">{v}%</td>
                      <td className="py-3 pr-4">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: `color-mix(in oklab, ${status.color} 15%, transparent)`,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 tabular font-semibold">+{impact} pts</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Score simulator */}
      <Card className="mt-6 border-2 border-amber/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">"What if…" simulator</h3>
          <p className="text-sm text-muted-foreground">See how your score reacts to better habits.</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              <SimSlider
                label="Pay utility bills more consistently"
                value={whatIfs.utility}
                onChange={(v) => setWhatIfs((s) => ({ ...s, utility: v }))}
              />
              <SimSlider
                label="Make more UPI transactions monthly"
                value={whatIfs.upi}
                onChange={(v) => setWhatIfs((s) => ({ ...s, upi: v }))}
              />
              <SimSlider
                label="Stabilize / verify employment"
                value={whatIfs.employment}
                onChange={(v) => setWhatIfs((s) => ({ ...s, employment: v }))}
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-secondary/40 p-6">
              <div className="text-xs font-semibold uppercase text-muted-foreground">Predicted score</div>
              <div className="mt-2 text-5xl font-bold tabular text-gradient-brand">{simulated}</div>
              <div className="mt-1 text-sm">
                {simulated > score ? (
                  <span className="text-success font-semibold">+{simulated - score} pts</span>
                ) : simulated < score ? (
                  <span className="text-destructive font-semibold">{simulated - score} pts</span>
                ) : (
                  <span className="text-muted-foreground">No change</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History table */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Score history</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4 font-semibold">Month</th>
                  <th className="py-2 pr-4 font-semibold">Score</th>
                  <th className="py-2 pr-4 font-semibold">Change</th>
                  <th className="py-2 font-semibold">Top factor</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const prev = i > 0 ? history[i - 1].score : h.score;
                  const change = h.score - prev;
                  return (
                    <tr key={h.month} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{h.month}</td>
                      <td className="py-2 pr-4 tabular">{h.score}</td>
                      <td
                        className={`py-2 pr-4 tabular font-semibold ${
                          change > 0 ? "text-success" : change < 0 ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {change > 0 ? "+" : ""}
                        {change}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {["Rent", "Utility", "Mobile", "UPI", "Employment"][i % 5]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function SimSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular text-muted-foreground">+{value}%</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => onChange(v[0])} min={0} max={30} step={1} />
    </div>
  );
}

function bandFromPct(p: number) {
  if (p < 40) return { label: "Poor", color: "var(--score-poor)" };
  if (p < 60) return { label: "Fair", color: "var(--score-fair)" };
  if (p < 75) return { label: "Good", color: "var(--score-good)" };
  if (p < 88) return { label: "Very Good", color: "var(--score-vgood)" };
  return { label: "Excellent", color: "var(--score-excellent)" };
}
