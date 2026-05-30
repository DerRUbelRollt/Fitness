// UI metadata for activities: icon registry + color palette.
//
// Activity preset *data* lives in src/data/presets.json and is served by
// the PresetService. This module only bridges icon ids (strings, which
// ARE serializable) to lucide-react components (which are not), so the
// JSON/service layer stays clean.

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
  type LucideIcon,
  Trophy,
  Sparkles,
  Moon,
  Target,
  Snowflake,
  Wind,
  Heart,
} from "lucide-react";

import { getServices } from "@/services";
import type { ActivityPresetData } from "@/types/domain";

// Icon registry — id strings used in JSON/data map to lucide components.
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  footprints: Footprints,
  bike: Bike,
  waves: Waves,
  heart: Heart,
  flame: Flame,
  mountain: Mountain,
  activity: Activity,
  zap: Zap,
  trophy: Trophy,
  sparkles: Sparkles,
  target: Target,
  snowflake: Snowflake,
  wind: Wind,
  "heart-pulse": HeartPulse,
  moon: Moon,
};

export function resolveIcon(iconId: string): LucideIcon {
  return ICON_REGISTRY[iconId] ?? Activity;
}

// Back-compat shape used by existing UI components.
export interface ActivityPreset extends ActivityPresetData {
  icon: LucideIcon;
}

export const ACTIVITY_PRESETS: ActivityPreset[] = getServices()
  .presets.list()
  .map((p) => ({ ...p, icon: resolveIcon(p.iconId) }));

export const ICON_OPTIONS: { id: string; icon: LucideIcon }[] = [
  "dumbbell",
  "footprints",
  "bike",
  "waves",
  "heart",
  "flame",
  "mountain",
  "activity",
  "zap",
  "trophy",
  "sparkles",
  "target",
  "snowflake",
  "wind",
  "heart-pulse",
].map((id) => ({ id, icon: resolveIcon(id) }));

export const COLOR_OPTIONS = [
  "#4ade80", "#22d3ee", "#60a5fa", "#a78bfa", "#f0abfc",
  "#fb923c", "#facc15", "#84cc16", "#fb7185", "#f87171",
  "#34d399", "#38bdf8", "#c084fc", "#94a3b8", "#86efac",
];

export function getPreset(id: string): ActivityPreset | undefined {
  return ACTIVITY_PRESETS.find((p) => p.id === id);
}
