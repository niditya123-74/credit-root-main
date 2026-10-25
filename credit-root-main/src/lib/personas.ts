import type { SignalScores } from "./score";

export type Persona = {
  id: string;
  name: string;
  city: string;
  description: string;
  signals: SignalScores;
};

export const PERSONAS: Persona[] = [
  {
    id: "priya",
    name: "Priya",
    city: "Jaipur",
    description: "Domestic worker, all bills paid on time, no bank account",
    signals: { utility: 92, mobile: 85, rent: 90, upi: 40, employment: 60 },
  },
  {
    id: "ravi",
    name: "Ravi",
    city: "Bhopal",
    description: "Freelance designer, irregular income, occasional late rent",
    signals: { utility: 70, mobile: 75, rent: 55, upi: 80, employment: 50 },
  },
  {
    id: "meena",
    name: "Meena",
    city: "Indore",
    description: "Street vendor, cash economy, minimal UPI",
    signals: { utility: 45, mobile: 50, rent: 60, upi: 20, employment: 35 },
  },
  {
    id: "arjun",
    name: "Arjun",
    city: "Bengaluru",
    description: "Salaried, all data connected, excellent habits",
    signals: { utility: 95, mobile: 90, rent: 95, upi: 88, employment: 95 },
  },
];
