import {
  Dumbbell,
  Footprints,
  Bike,
  Waves,
  HeartPulse,
  Flame,
  Mountain,
  Activity,
  Zap,
  CircleDot,
  type LucideIcon,
  Trophy,
  Sparkles,
  Moon,
  Target,
  Snowflake,
  Wind,
  Heart,
} from "lucide-react";

export type ActivityPreset = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string; // hsl-like accent
  defaultDurationMin: number;
};

export const ACTIVITY_PRESETS: ActivityPreset[] = [
  { id: "gym", label: "Gym", icon: Dumbbell, color: "#4ade80", defaultDurationMin: 60 },
  { id: "football", label: "Fußball", icon: CircleDot, color: "#22d3ee", defaultDurationMin: 90 },
  { id: "running", label: "Joggen", icon: Footprints, color: "#34d399", defaultDurationMin: 30 },
  { id: "cycling", label: "Fahrrad", icon: Bike, color: "#60a5fa", defaultDurationMin: 45 },
  { id: "swimming", label: "Schwimmen", icon: Waves, color: "#38bdf8", defaultDurationMin: 45 },
  { id: "yoga", label: "Yoga", icon: Heart, color: "#a78bfa", defaultDurationMin: 30 },
  { id: "stretching", label: "Stretching", icon: Wind, color: "#f0abfc", defaultDurationMin: 15 },
  { id: "basketball", label: "Basketball", icon: Trophy, color: "#fb923c", defaultDurationMin: 60 },
  { id: "tennis", label: "Tennis", icon: Sparkles, color: "#facc15", defaultDurationMin: 60 },
  { id: "hiking", label: "Wandern", icon: Mountain, color: "#84cc16", defaultDurationMin: 120 },
  { id: "steps", label: "10k Schritte", icon: Footprints, color: "#86efac", defaultDurationMin: 60 },
  { id: "mobility", label: "Mobility", icon: Activity, color: "#c084fc", defaultDurationMin: 20 },
  { id: "home", label: "Home Workout", icon: Dumbbell, color: "#fb7185", defaultDurationMin: 30 },
  { id: "hiit", label: "HIIT", icon: Zap, color: "#facc15", defaultDurationMin: 25 },
  { id: "strength", label: "Krafttraining", icon: Dumbbell, color: "#4ade80", defaultDurationMin: 60 },
  { id: "cardio", label: "Cardio", icon: HeartPulse, color: "#f87171", defaultDurationMin: 40 },
  { id: "recovery", label: "Regeneration", icon: Moon, color: "#94a3b8", defaultDurationMin: 30 },
];

export const ICON_OPTIONS: { id: string; icon: LucideIcon }[] = [
  { id: "dumbbell", icon: Dumbbell },
  { id: "footprints", icon: Footprints },
  { id: "bike", icon: Bike },
  { id: "waves", icon: Waves },
  { id: "heart", icon: Heart },
  { id: "flame", icon: Flame },
  { id: "mountain", icon: Mountain },
  { id: "activity", icon: Activity },
  { id: "zap", icon: Zap },
  { id: "trophy", icon: Trophy },
  { id: "sparkles", icon: Sparkles },
  { id: "target", icon: Target },
  { id: "snowflake", icon: Snowflake },
  { id: "wind", icon: Wind },
  { id: "heart-pulse", icon: HeartPulse },
];

export const COLOR_OPTIONS = [
  "#4ade80", "#22d3ee", "#60a5fa", "#a78bfa", "#f0abfc",
  "#fb923c", "#facc15", "#84cc16", "#fb7185", "#f87171",
  "#34d399", "#38bdf8", "#c084fc", "#94a3b8", "#86efac",
];

export function getPreset(id: string): ActivityPreset | undefined {
  return ACTIVITY_PRESETS.find((p) => p.id === id);
}
