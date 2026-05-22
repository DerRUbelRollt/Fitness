import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  max,
  size = 120,
  stroke = 10,
  color = "var(--color-primary)",
  trackColor = "oklch(0.3 0.012 250)",
  label,
  sublabel,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value / max));
  const offset = c * (1 - pct);

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-bold leading-none">{label ?? `${Math.round(pct * 100)}%`}</div>
          {sublabel && <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{sublabel}</div>}
        </div>
      </div>
    </div>
  );
}
