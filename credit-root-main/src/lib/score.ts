export type SignalKey = "utility" | "mobile" | "rent" | "upi" | "employment";

export const SIGNAL_WEIGHTS: Record<SignalKey, number> = {
  utility: 0.25,
  mobile: 0.15,
  rent: 0.3,
  upi: 0.15,
  employment: 0.15,
};

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  utility: "Utility Bills",
  mobile: "Mobile Recharge",
  rent: "Rent Payments",
  upi: "UPI Transactions",
  employment: "Employment",
};

export type SignalScores = Record<SignalKey, number>; // 0-100 each

export function computeScore(s: SignalScores): number {
  const weighted =
    s.utility * SIGNAL_WEIGHTS.utility +
    s.mobile * SIGNAL_WEIGHTS.mobile +
    s.rent * SIGNAL_WEIGHTS.rent +
    s.upi * SIGNAL_WEIGHTS.upi +
    s.employment * SIGNAL_WEIGHTS.employment;
  return Math.round(300 + (weighted / 100) * 550);
}

export type ScoreBand = {
  label: string;
  min: number;
  max: number;
  color: string; // css var name
  description: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  { label: "Poor", min: 300, max: 499, color: "var(--score-poor)", description: "Very limited access" },
  { label: "Fair", min: 500, max: 599, color: "var(--score-fair)", description: "Some options available" },
  { label: "Good", min: 600, max: 699, color: "var(--score-good)", description: "Standard loan access" },
  { label: "Very Good", min: 700, max: 749, color: "var(--score-vgood)", description: "Competitive rates" },
  { label: "Excellent", min: 750, max: 850, color: "var(--score-excellent)", description: "Best offers unlocked" },
];

export function getBand(score: number): ScoreBand {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ?? SCORE_BANDS[0];
}

export function bandLabel(score: number) {
  return getBand(score).label;
}
