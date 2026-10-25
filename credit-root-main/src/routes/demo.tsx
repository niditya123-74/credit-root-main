import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScoreGauge } from "@/components/ScoreGauge";
import { useAppStore, useScore } from "@/store/useAppStore";
import { PERSONAS } from "@/lib/personas";
import { SCORE_BANDS, SIGNAL_LABELS, type SignalKey } from "@/lib/score";
import { FlaskConical, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo Panel — CreditRoot" },
      { name: "description", content: "Switch personas and simulate any score scenario." },
    ],
  }),
  component: Demo,
});

function Demo() {
  const signals = useAppStore((s) => s.signals);
  const setSignals = useAppStore((s) => s.setSignals);
  const setSignal = useAppStore((s) => s.setSignal);
  const setProfile = useAppStore((s) => s.setProfile);
  const score = useScore();

  return (
    <AppShell>
      <div className="flex items-center gap-2">
        <FlaskConical className="h-6 w-6 text-amber" />
        <h1 className="text-2xl font-bold sm:text-3xl">Demo Panel</h1>
      </div>
      <p className="text-sm text-muted-foreground">For judges and testers. Switch personas instantly to see how the entire app adapts.</p>

      {/* Persona selector */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">User personas</h3>
          <p className="text-sm text-muted-foreground">Pick a real-world story.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSignals(p.signals);
                  setProfile({ name: p.name, city: p.city });
                  toast.success(`Loaded persona: ${p.name}`);
                }}
                className="rounded-xl border-2 p-4 text-left transition hover:border-primary hover:shadow-elevate"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-primary-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.city}</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{p.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live simulator */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Manual signal simulator</h3>
            <p className="text-sm text-muted-foreground">Drag sliders to see the score react in real time.</p>
            <div className="mt-5 space-y-5">
              {(Object.keys(signals) as SignalKey[]).map((k) => (
                <div key={k}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{SIGNAL_LABELS[k]}</span>
                    <span className="tabular text-muted-foreground">{Math.round(signals[k])}%</span>
                  </div>
                  <Slider
                    value={[signals[k]]}
                    onValueChange={(v) => setSignal(k, v[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="flex flex-col items-center p-6">
            <div className="text-xs uppercase text-muted-foreground">Live score</div>
            <ScoreGauge score={score} size={220} animate={false} />
          </CardContent>
        </Card>
      </div>

      {/* Band showcase */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Jump to a score band</h3>
          <p className="text-sm text-muted-foreground">Preview how the UI feels at every level.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SCORE_BANDS.map((b) => {
              const target = Math.round((b.min + b.max) / 2);
              // Reverse-engineer roughly equal signals
              const pct = ((target - 300) / 550) * 100;
              return (
                <Button
                  key={b.label}
                  variant="outline"
                  onClick={() => {
                    setSignals({
                      utility: pct,
                      mobile: pct,
                      rent: pct,
                      upi: pct,
                      employment: pct,
                    });
                    toast.success(`Loaded ${b.label} band (~${target})`);
                  }}
                  style={{ borderColor: b.color, color: b.color }}
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {b.label} · {target}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
