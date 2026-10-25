import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBand } from "@/lib/score";

type Props = {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animate?: boolean;
};

export function ScoreGauge({ score, size = 220, strokeWidth = 16, showLabel = true, animate = true }: Props) {
  const min = 300;
  const max = 850;
  const pct = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const band = getBand(score);

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // semicircle
  const dashOffset = circumference * (1 - pct);

  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    const start = displayScore;
    const target = score;
    const duration = 1200;
    const startTime = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setDisplayScore(Math.round(start + (target - start) * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--score-poor)" />
            <stop offset="35%" stopColor="var(--score-fair)" />
            <stop offset="55%" stopColor="var(--score-good)" />
            <stop offset="75%" stopColor="var(--score-vgood)" />
            <stop offset="100%" stopColor="var(--score-excellent)" />
          </linearGradient>
        </defs>
        {/* track */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: animate ? 1.2 : 0, ease: "easeOut" }}
        />
      </svg>
      <div className="-mt-10 text-center">
        <div className="tabular text-5xl font-bold leading-none" style={{ color: band.color }}>
          {displayScore}
        </div>
        {showLabel && (
          <div className="mt-2">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: `color-mix(in oklab, ${band.color} 15%, transparent)`, color: band.color }}
            >
              {band.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
