import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { computeScore, type SignalScores } from "@/lib/score";

export type ThemeMode = "light" | "dark" | "system";

export type Profile = {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  employmentType?: string;
  income?: string;
  monthlyRent?: number;
  rechargeAmount?: number;
  upiCount?: number;
};

export type ConnectedSources = {
  utility: boolean;
  mobile: boolean;
  rent: boolean;
  upi: boolean;
  employment: boolean;
};

export type ActivityItem = {
  id: string;
  date: string; // ISO
  text: string;
  delta: number; // +/- pts
  type: "good" | "bad" | "info";
};

type State = {
  theme: ThemeMode;
  isOnboarded: boolean;
  profile: Profile;
  sources: ConnectedSources;
  signals: SignalScores;
  scoreHistory: { month: string; score: number }[];
  activity: ActivityItem[];
  habitDone: Record<string, boolean>;
  appliedLoans: string[];

  setTheme: (t: ThemeMode) => void;
  setProfile: (p: Partial<Profile>) => void;
  setSource: (k: keyof ConnectedSources, v: boolean) => void;
  setSignal: (k: keyof SignalScores, v: number) => void;
  setSignals: (s: SignalScores) => void;
  completeOnboarding: () => void;
  reset: () => void;
  toggleHabit: (id: string) => void;
  applyLoan: (id: string) => void;
  addActivity: (a: Omit<ActivityItem, "id">) => void;
};

const defaultSignals: SignalScores = { utility: 70, mobile: 65, rent: 80, upi: 55, employment: 60 };

function generateHistory(currentScore: number) {
  const months = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  return months.map((m, i) => {
    const drift = Math.round(Math.sin(i * 0.7) * 25 - (11 - i) * 4);
    return { month: m, score: Math.max(300, Math.min(850, currentScore + drift - 30)) };
  });
}

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      theme: "system",
      isOnboarded: false,
      profile: { name: "", phone: "" },
      sources: { utility: false, mobile: false, rent: false, upi: false, employment: false },
      signals: defaultSignals,
      scoreHistory: generateHistory(computeScore(defaultSignals)),
      activity: [
        { id: "a1", date: new Date().toISOString(), text: "Electricity bill paid on time — Nov", delta: 5, type: "good" },
        { id: "a2", date: new Date(Date.now() - 2 * 86400000).toISOString(), text: "Mobile recharge ₹299", delta: 2, type: "good" },
        { id: "a3", date: new Date(Date.now() - 7 * 86400000).toISOString(), text: "Rent payment 3 days late — Oct", delta: -8, type: "bad" },
        { id: "a4", date: new Date(Date.now() - 10 * 86400000).toISOString(), text: "5 UPI transactions this week", delta: 3, type: "good" },
      ],
      habitDone: {},
      appliedLoans: [],

      setTheme: (theme) => set({ theme }),
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setSource: (k, v) => set((s) => ({ sources: { ...s.sources, [k]: v } })),
      setSignal: (k, v) => {
        const signals = { ...get().signals, [k]: v };
        set({ signals, scoreHistory: generateHistory(computeScore(signals)) });
      },
      setSignals: (signals) => set({ signals, scoreHistory: generateHistory(computeScore(signals)) }),
      completeOnboarding: () => set({ isOnboarded: true }),
      reset: () =>
        set({
          isOnboarded: false,
          profile: { name: "", phone: "" },
          sources: { utility: false, mobile: false, rent: false, upi: false, employment: false },
          signals: defaultSignals,
          appliedLoans: [],
          habitDone: {},
        }),
      toggleHabit: (id) => set((s) => ({ habitDone: { ...s.habitDone, [id]: !s.habitDone[id] } })),
      applyLoan: (id) => set((s) => ({ appliedLoans: Array.from(new Set([...s.appliedLoans, id])) })),
      addActivity: (a) =>
        set((s) => ({
          activity: [{ id: Math.random().toString(36).slice(2), ...a }, ...s.activity].slice(0, 30),
        })),
    }),
    {
      name: "creditroot-store",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as never))),
    }
  )
);

export function useScore() {
  const signals = useAppStore((s) => s.signals);
  return computeScore(signals);
}
