import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppStore, useScore } from "@/store/useAppStore";
import { CheckCircle2, Circle, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/improve")({
  head: () => ({
    meta: [
      { title: "Improve My Score — CreditRoot" },
      { name: "description", content: "Personalized action plan and habits to grow your CreditRoot score." },
    ],
  }),
  component: Improve,
});

const ACTIONS = [
  { id: "a1", title: "Pay electricity bill 3 days early", gain: 8, difficulty: "Easy", time: "Next month" },
  { id: "a2", title: "Connect UPI to CreditRoot", gain: 15, difficulty: "Easy", time: "Instant" },
  { id: "a3", title: "Make 5+ UPI transactions per week", gain: 6, difficulty: "Easy", time: "1 month" },
  { id: "a4", title: "Verify employment via Aadhaar", gain: 12, difficulty: "Medium", time: "1–2 days" },
  { id: "a5", title: "Pay rent on or before the 5th", gain: 18, difficulty: "Medium", time: "2 months" },
  { id: "a6", title: "Avoid late mobile recharges for 3 months", gain: 9, difficulty: "Easy", time: "3 months" },
];

const HABITS = [
  { id: "h1", text: "Pay electricity bill this week" },
  { id: "h2", text: "Recharge mobile before due date" },
  { id: "h3", text: "Log rent payment" },
  { id: "h4", text: "Make 3+ UPI transactions" },
  { id: "h5", text: "Review your CreditRoot dashboard" },
];

const ARTICLES = [
  {
    title: "How your utility payment timing affects your score",
    body:
      "Paying within the grace period is fine, but paying 3+ days early signals reliability. Our model rewards consistency more heavily than amount.",
  },
  {
    title: "Why gig workers can still get high scores",
    body:
      "Income volatility is fine if total monthly inflow stays steady. We weight rent and utility consistency higher than employment type.",
  },
  {
    title: "Understanding the 0–850 scale",
    body:
      "300 is the floor (no data). 500–599 is fair. 700+ unlocks competitive lender rates. The model is calibrated against real default outcomes.",
  },
  {
    title: "What lenders actually look for",
    body:
      "Beyond your score, lenders weigh stability of payment patterns over the last 6 months, and presence of multiple data sources.",
  },
];

function Improve() {
  const habits = useAppStore((s) => s.habitDone);
  const toggle = useAppStore((s) => s.toggleHabit);
  const score = useScore();

  const completion = useMemo(() => {
    const done = HABITS.filter((h) => habits[h.id]).length;
    return Math.round((done / HABITS.length) * 100);
  }, [habits]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold sm:text-3xl">Improve My Score</h1>
      <p className="text-sm text-muted-foreground">A personalized action plan, ranked by impact.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Action plan */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Your action plan</h3>
            <ol className="mt-4 space-y-3">
              {ACTIONS.sort((a, b) => b.gain - a.gain).map((a, i) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted/30"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{a.title}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">{a.difficulty}</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success tabular">
                    +{a.gain} pts
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Habit tracker */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Weekly habits</h3>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--muted)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeDasharray={`${completion} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-sm font-bold tabular">{completion}%</div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete habits weekly to keep your score climbing.
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {HABITS.map((h) => {
                  const done = !!habits[h.id];
                  return (
                    <li key={h.id}>
                      <button
                        onClick={() => toggle(h.id)}
                        className={`flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition ${
                          done ? "border-success/30 bg-success/5 line-through text-muted-foreground" : ""
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        {h.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Score goal */}
          <Card className="border-2 border-amber/30 bg-amber/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber" />
                <h3 className="font-semibold">Score goal</h3>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-background p-3">
                  <div className="text-xs text-muted-foreground">Current</div>
                  <div className="text-2xl font-bold tabular">{score}</div>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="text-xs text-muted-foreground">Goal</div>
                  <div className="text-2xl font-bold tabular text-gradient-brand">{Math.min(850, score + 80)}</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Achievable in ~3 months by completing your top 3 actions.
              </p>
              <Button size="sm" className="mt-3 w-full bg-gradient-brand text-primary-foreground">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Set my plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold">Learning center</h3>
          <Accordion type="single" collapsible className="mt-3">
            {ARTICLES.map((a, i) => (
              <AccordionItem key={i} value={`a${i}`}>
                <AccordionTrigger>{a.title}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </AppShell>
  );
}
