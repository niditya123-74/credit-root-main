import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Zap,
  Smartphone,
  Home,
  Wallet,
  Briefcase,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { computeScore, getBand, type SignalKey } from "@/lib/score";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — CreditRoot" },
      { name: "description", content: "Create your CreditRoot account and get your first score in under 3 minutes." },
    ],
  }),
  component: Signup,
});

const SOURCES: { key: SignalKey; label: string; Icon: typeof Zap; desc: string }[] = [
  { key: "utility", label: "Utility Bills", Icon: Zap, desc: "DisCom / electricity board" },
  { key: "mobile", label: "Mobile Recharge", Icon: Smartphone, desc: "Airtel, Jio, Vi" },
  { key: "rent", label: "Rent Payments", Icon: Home, desc: "Monthly rent history" },
  { key: "upi", label: "UPI Transactions", Icon: Wallet, desc: "Google Pay, PhonePe, Paytm" },
  { key: "employment", label: "Employment", Icon: Briefcase, desc: "Aadhaar-linked or self-reported" },
];

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background root-pattern">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Step {step} of 5</span>
            <span>{Math.round((step / 5) * 100)}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-brand"
              initial={false}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <Step1 onNext={() => setStep(2)} />}
            {step === 2 && <Step2 onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <Step3 onBack={() => setStep(2)} onNext={() => setStep(4)} />}
            {step === 4 && <Step4 onDone={() => setStep(5)} />}
            {step === 5 && (
              <Step5
                onGo={() => {
                  navigate({ to: "/dashboard" });
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step1({ onNext }: { onNext: () => void }) {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  return (
    <Card className="border-2">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Tell us about you</h2>
        <p className="mt-1 text-sm text-muted-foreground">We'll send a one-time code to verify your phone.</p>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Priya Sharma"
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm font-medium">
                +91
              </span>
              <Input
                id="phone"
                placeholder="98XXXXXXXX"
                value={profile.phone}
                onChange={(e) => setProfile({ phone: e.target.value })}
                className="rounded-l-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={profile.email ?? ""}
                onChange={(e) => setProfile({ email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>City / State</Label>
              <Select value={profile.city ?? ""} onValueChange={(v) => setProfile({ city: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Jaipur, RJ", "Bhopal, MP", "Indore, MP", "Bengaluru, KA", "Mumbai, MH", "Delhi, DL", "Pune, MH"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!otpSent ? (
            <Button
              onClick={() => {
                if (!profile.name || !profile.phone) {
                  toast.error("Name and phone are required");
                  return;
                }
                setOtpSent(true);
                toast.success("OTP sent (demo: any 6 digits work)");
              }}
              className="w-full bg-gradient-brand text-primary-foreground"
            >
              Send OTP
            </Button>
          ) : (
            <div className="rounded-lg border bg-muted/30 p-4">
              <Label>Enter 6-digit OTP</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                className="mt-2 tabular text-center text-lg tracking-[0.5em]"
                maxLength={6}
              />
              <Button
                onClick={() => {
                  if (otp.length === 6) onNext();
                  else toast.error("Enter a 6-digit code");
                }}
                className="mt-3 w-full bg-gradient-brand text-primary-foreground"
              >
                Verify & continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Step2({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const sources = useAppStore((s) => s.sources);
  const setSource = useAppStore((s) => s.setSource);
  const [connecting, setConnecting] = useState<SignalKey | null>(null);

  const connect = (k: SignalKey) => {
    setConnecting(k);
    setTimeout(() => {
      setSource(k, true);
      setConnecting(null);
      toast.success(`${SOURCES.find((s) => s.key === k)?.label} connected!`);
    }, 1200);
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Connect your data sources</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The more you connect, the more accurate your score. You can add more later.
        </p>
        <div className="mt-6 space-y-3">
          {SOURCES.map(({ key, label, Icon, desc }) => {
            const connected = sources[key];
            const loading = connecting === key;
            return (
              <div
                key={key}
                className={`flex items-center justify-between rounded-xl border-2 p-4 transition ${
                  connected ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-lg ${
                      connected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
                {connected ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                    <Check className="h-3 w-3" /> Connected
                  </span>
                ) : (
                  <Button size="sm" variant="outline" disabled={loading} onClick={() => connect(key)}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!Object.values(sources).some(Boolean)}
            className="bg-gradient-brand text-primary-foreground"
          >
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const setSignals = useAppStore((s) => s.setSignals);
  const setProfile = useAppStore((s) => s.setProfile);
  const [util, setUtil] = useState(80);
  const [recharge, setRecharge] = useState(299);
  const [rent, setRent] = useState(12000);
  const [rentPaid, setRentPaid] = useState<boolean[]>(Array.from({ length: 12 }, () => true));
  const [upi, setUpi] = useState(15);
  const [empType, setEmpType] = useState("Salaried");

  const onSubmit = () => {
    const rentScore = (rentPaid.filter(Boolean).length / 12) * 100;
    const upiScore = Math.min(100, (upi / 30) * 100);
    const mobileScore = Math.min(100, 50 + (recharge / 999) * 50);
    const empScore =
      empType === "Salaried" ? 90 : empType === "Self-Employed" ? 70 : empType === "Gig Worker" ? 60 : 45;
    setSignals({
      utility: util,
      mobile: mobileScore,
      rent: rentScore,
      upi: upiScore,
      employment: empScore,
    });
    setProfile({ employmentType: empType, monthlyRent: rent, rechargeAmount: recharge, upiCount: upi });
    onNext();
  };

  return (
    <Card className="border-2">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="text-2xl font-bold">A few quick details</h2>
          <p className="mt-1 text-sm text-muted-foreground">Help us understand your real-world habits.</p>
        </div>

        {/* Utility */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Utility bill consistency (last 6 months)</h3>
          </div>
          <div className="mt-3">
            <Slider value={[util]} onValueChange={(v) => setUtil(v[0])} min={0} max={100} step={5} />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Often missed</span>
              <span className="font-semibold text-foreground tabular">{util}% on time</span>
              <span>Always on time</span>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Average monthly recharge</h3>
          </div>
          <Slider
            className="mt-3"
            value={[recharge]}
            onValueChange={(v) => setRecharge(v[0])}
            min={99}
            max={999}
            step={50}
          />
          <div className="mt-2 text-right text-sm tabular font-semibold">₹{recharge}</div>
        </div>

        {/* Rent */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Rent payment history</h3>
          </div>
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">Monthly rent</Label>
            <Input
              type="number"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="mt-1 tabular"
            />
          </div>
          <div className="mt-4">
            <Label className="text-xs text-muted-foreground">Last 12 months — click to toggle paid/unpaid</Label>
            <div className="mt-2 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
              {rentPaid.map((paid, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setRentPaid((prev) => prev.map((p, idx) => (idx === i ? !p : p)))
                  }
                  className={`aspect-square rounded-md text-[10px] font-bold transition ${
                    paid
                      ? "bg-success/80 text-success-foreground hover:bg-success"
                      : "bg-destructive/70 text-destructive-foreground hover:bg-destructive"
                  }`}
                  aria-label={`Month ${i + 1} ${paid ? "paid" : "unpaid"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* UPI */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Average monthly UPI transactions</h3>
          </div>
          <Slider className="mt-3" value={[upi]} onValueChange={(v) => setUpi(v[0])} min={0} max={50} step={1} />
          <div className="mt-2 text-right text-sm tabular font-semibold">{upi} per month</div>
        </div>

        {/* Employment */}
        <div className="rounded-xl border p-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Employment type</h3>
          </div>
          <Select value={empType} onValueChange={setEmpType}>
            <SelectTrigger className="mt-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Salaried", "Self-Employed", "Gig Worker", "Daily Wage"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between pt-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button onClick={onSubmit} className="bg-gradient-brand text-primary-foreground">
            Generate my score <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step4({ onDone }: { onDone: () => void }) {
  const signals = useAppStore((s) => s.signals);
  const finalScore = computeScore(signals);
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");
  const [progress, setProgress] = useState(0);
  const [bullet, setBullet] = useState(0);

  const bullets = [
    "Analyzing utility payment consistency...",
    "Checking mobile recharge patterns...",
    "Evaluating rent payment history...",
    "Computing behavioral score...",
    "Finalizing your CreditRoot score...",
  ];

  useEffect(() => {
    const start = Date.now();
    const dur = 3000;
    const t = setInterval(() => {
      const k = Math.min(1, (Date.now() - start) / dur);
      setProgress(Math.round(k * 100));
      setBullet(Math.min(bullets.length - 1, Math.floor(k * bullets.length)));
      if (k >= 1) {
        clearInterval(t);
        setTimeout(() => setPhase("reveal"), 300);
      }
    }, 50);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "loading") {
    return (
      <Card className="border-2">
        <CardContent className="p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">Analyzing your data…</h2>
          <p className="mt-2 text-sm text-muted-foreground">Hang tight. This usually takes 3 seconds.</p>
          <div className="mx-auto mt-6 max-w-md">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-brand transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">{bullets[bullet]}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const band = getBand(finalScore);

  return (
    <Card className="border-2">
      <CardContent className="p-10 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-amber" />
        <h2 className="mt-3 text-2xl font-bold">Your CreditRoot score is ready</h2>
        <p className="mt-1 text-sm text-muted-foreground">Based on your real financial behavior.</p>
        <div className="mt-6 flex justify-center">
          <ScoreGauge score={finalScore} size={280} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{band.description}</p>
        <Button onClick={onDone} size="lg" className="mt-8 bg-gradient-brand text-primary-foreground">
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function Step5({ onGo }: { onGo: () => void }) {
  const profile = useAppStore((s) => s.profile);
  const sources = useAppStore((s) => s.sources);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const connectedCount = Object.values(sources).filter(Boolean).length;

  return (
    <Card className="border-2">
      <CardContent className="p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-brand">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Welcome to CreditRoot, {profile.name.split(" ")[0] || "there"} 🌱</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You connected <strong className="text-foreground">{connectedCount} of 5</strong> data sources. You can
          add more anytime to improve accuracy.
        </p>
        <Button
          onClick={() => {
            completeOnboarding();
            onGo();
          }}
          size="lg"
          className="mt-8 bg-gradient-brand text-primary-foreground"
        >
          Go to my dashboard <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
