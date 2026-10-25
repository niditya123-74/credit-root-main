import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { LENDERS, type Lender } from "@/lib/lenders";
import { useAppStore, useScore } from "@/store/useAppStore";
import { Check, X, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/lenders")({
  head: () => ({
    meta: [
      { title: "Lender Marketplace — CreditRoot" },
      { name: "description", content: "Browse loan offers tailored to your CreditRoot score." },
    ],
  }),
  component: Lenders,
});

function Lenders() {
  const score = useScore();
  const [type, setType] = useState<string>("all");
  const [maxAmount, setMaxAmount] = useState(500000);
  const [sort, setSort] = useState<"match" | "rate" | "amount">("match");

  const filtered = useMemo(() => {
    let list = LENDERS.filter((l) => (type === "all" ? true : l.loanType === type));
    list = list.filter((l) => l.amountMin <= maxAmount);
    if (sort === "rate") list = [...list].sort((a, b) => a.rateMin - b.rateMin);
    else if (sort === "amount") list = [...list].sort((a, b) => b.amountMax - a.amountMax);
    else
      list = [...list].sort((a, b) => {
        const aQual = a.minScore <= score ? 0 : 1;
        const bQual = b.minScore <= score ? 0 : 1;
        if (aQual !== bQual) return aQual - bQual;
        return a.rateMin - b.rateMin;
      });
    return list;
  }, [type, maxAmount, sort, score]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold sm:text-3xl">Lender Marketplace</h1>
      <p className="text-sm text-muted-foreground">Real lenders, ranked for your CreditRoot score of <strong className="tabular text-foreground">{score}</strong>.</p>

      {/* Filters */}
      <Card className="mt-6">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <Label className="text-xs text-muted-foreground">Loan type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Micro">Micro</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Max amount needed</Label>
            <div className="mt-3 px-1">
              <Slider value={[maxAmount]} onValueChange={(v) => setMaxAmount(v[0])} min={5000} max={1000000} step={5000} />
              <div className="mt-1 text-right text-xs tabular">₹{maxAmount.toLocaleString("en-IN")}</div>
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sort by</Label>
            <Select value={sort} onValueChange={(v) => setSort(v as never)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best match</SelectItem>
                <SelectItem value="rate">Lowest rate</SelectItem>
                <SelectItem value="amount">Highest amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((l) => (
          <LenderCard key={l.id} lender={l} score={score} />
        ))}
      </div>
    </AppShell>
  );
}

function LenderCard({ lender, score }: { lender: Lender; score: number }) {
  const qualifies = score >= lender.minScore;
  const applied = useAppStore((s) => s.appliedLoans.includes(lender.id));
  const apply = useAppStore((s) => s.applyLoan);
  const profile = useAppStore((s) => s.profile);

  const [eligOpen, setEligOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const [amount, setAmount] = useState(Math.min(50000, lender.amountMax));
  const [purpose, setPurpose] = useState("Personal expense");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="transition hover:shadow-elevate">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-sm font-bold text-primary-foreground"
              style={{ background: lender.color }}
            >
              {lender.initials}
            </div>
            <div>
              <div className="font-semibold">{lender.name}</div>
              <div className="text-xs text-muted-foreground">{lender.type} · {lender.loanType}</div>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
              qualifies ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
            }`}
          >
            {qualifies ? "You qualify" : `Need ${lender.minScore - score} pts`}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div>
            <div className="text-muted-foreground">Amount</div>
            <div className="tabular font-semibold">
              ₹{(lender.amountMin / 1000).toFixed(0)}K – ₹{(lender.amountMax / 1000).toFixed(0)}K
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Rate</div>
            <div className="tabular font-semibold">{lender.rateMin}–{lender.rateMax}% p.a.</div>
          </div>
          <div>
            <div className="text-muted-foreground">Tenure</div>
            <div className="tabular font-semibold">{lender.tenures.join("/")} mo</div>
          </div>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-foreground">
            <Sparkles className="h-3 w-3" /> {lender.feature}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Dialog open={eligOpen} onOpenChange={setEligOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">Check eligibility</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Eligibility for {lender.name}</DialogTitle>
              </DialogHeader>
              <ul className="space-y-2 text-sm">
                <Crit ok={qualifies} label={`Minimum score ${lender.minScore}`} value={`Yours: ${score}`} />
                <Crit ok={true} label="Phone verified" value="✓" />
                <Crit ok={!!profile.employmentType} label="Employment data" value={profile.employmentType ?? "Missing"} />
                <Crit ok={true} label="Tenure available" value={`${lender.tenures.join(", ")} mo`} />
              </ul>
              <div className={`mt-2 rounded-lg p-3 text-sm ${qualifies ? "bg-success/10 text-success" : "bg-amber/10 text-amber-foreground"}`}>
                {qualifies
                  ? "🎉 You qualify! Ready to apply."
                  : `You're ${lender.minScore - score} points away. Improve UPI activity or connect employment data to close the gap.`}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={appOpen} onOpenChange={(o) => { setAppOpen(o); if (!o) setSubmitted(false); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 bg-gradient-brand text-primary-foreground" disabled={!qualifies}>
                {applied ? "Applied" : "Apply now"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              {!submitted ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Apply to {lender.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Loan amount</Label>
                      <div className="mt-2 px-1">
                        <Slider
                          value={[amount]}
                          onValueChange={(v) => setAmount(v[0])}
                          min={lender.amountMin}
                          max={lender.amountMax}
                          step={1000}
                        />
                        <div className="mt-1 text-right text-sm tabular font-semibold">₹{amount.toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                    <div>
                      <Label>Purpose</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Personal expense", "Medical", "Education", "Business", "Home repair"].map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Name</Label>
                        <Input value={profile.name} readOnly className="mt-1 bg-muted" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input value={profile.phone} readOnly className="mt-1 bg-muted" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      disabled={submitting}
                      onClick={() => {
                        setSubmitting(true);
                        setTimeout(() => {
                          apply(lender.id);
                          setSubmitting(false);
                          setSubmitted(true);
                          toast.success("Application submitted!");
                        }, 1200);
                      }}
                      className="bg-gradient-brand text-primary-foreground"
                    >
                      {submitting ? "Submitting..." : "Submit application"}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success text-success-foreground">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">Application submitted!</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lender.name} will review your CreditRoot score and respond within 24 hours.
                  </p>
                  <div className="mt-3 inline-block rounded-lg bg-muted px-3 py-1 text-xs tabular">
                    Application ID: CR-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function Crit({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between rounded-lg border p-2.5">
      <span className="flex items-center gap-2">
        {ok ? (
          <Check className="h-4 w-4 text-success" />
        ) : (
          <X className="h-4 w-4 text-destructive" />
        )}
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{value}</span>
    </li>
  );
}
