export type Lender = {
  id: string;
  name: string;
  type: "NBFC" | "Microfinance" | "Digital Lender" | "Bank";
  initials: string;
  color: string; // hsl/css var
  loanType: "Personal" | "Business" | "Micro" | "Emergency";
  amountMin: number;
  amountMax: number;
  rateMin: number;
  rateMax: number;
  minScore: number;
  tenures: number[]; // months
  feature: string;
};

export const LENDERS: Lender[] = [
  { id: "l1", name: "GreenSprout Finance", type: "NBFC", initials: "GS", color: "var(--primary)", loanType: "Personal", amountMin: 10000, amountMax: 200000, rateMin: 12, rateMax: 18, minScore: 600, tenures: [6, 12, 24], feature: "No collateral" },
  { id: "l2", name: "RootUp Microcredit", type: "Microfinance", initials: "RU", color: "var(--amber)", loanType: "Micro", amountMin: 5000, amountMax: 50000, rateMin: 14, rateMax: 22, minScore: 450, tenures: [3, 6, 12], feature: "Gig worker friendly" },
  { id: "l3", name: "Banyan Digital", type: "Digital Lender", initials: "BD", color: "var(--chart-4)", loanType: "Personal", amountMin: 25000, amountMax: 500000, rateMin: 10, rateMax: 16, minScore: 680, tenures: [12, 24, 36], feature: "Instant disbursal" },
  { id: "l4", name: "Sahyog Bank", type: "Bank", initials: "SB", color: "var(--primary-glow)", loanType: "Business", amountMin: 50000, amountMax: 500000, rateMin: 11, rateMax: 15, minScore: 700, tenures: [12, 24, 36], feature: "Lowest rates" },
  { id: "l5", name: "QuickRoot", type: "Digital Lender", initials: "QR", color: "var(--score-excellent)", loanType: "Emergency", amountMin: 5000, amountMax: 30000, rateMin: 18, rateMax: 28, minScore: 500, tenures: [3, 6], feature: "Disbursed in 15 mins" },
  { id: "l6", name: "Udaan Finance", type: "NBFC", initials: "UF", color: "var(--chart-5)", loanType: "Personal", amountMin: 15000, amountMax: 150000, rateMin: 13, rateMax: 19, minScore: 580, tenures: [6, 12, 18], feature: "No prepayment fee" },
  { id: "l7", name: "Krishi Sahayak", type: "Microfinance", initials: "KS", color: "var(--score-good)", loanType: "Micro", amountMin: 10000, amountMax: 80000, rateMin: 15, rateMax: 20, minScore: 520, tenures: [6, 12], feature: "Rural focus" },
  { id: "l8", name: "ApexCredit", type: "NBFC", initials: "AC", color: "var(--score-vgood)", loanType: "Business", amountMin: 100000, amountMax: 1000000, rateMin: 11, rateMax: 14, minScore: 720, tenures: [24, 36, 48], feature: "Premium offers" },
];
