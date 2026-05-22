import { ICON_OPTIONS } from "@/lib/activities";
import { Activity } from "lucide-react";

export function ActivityIcon({ iconId, color, size = 18 }: { iconId: string; color?: string; size?: number }) {
  // Try preset id first
  const preset = ICON_OPTIONS.find((i) => i.id === iconId);
  const fallback = (() => {
    // try matching with activity preset ids
    const map: Record<string, string> = {
      gym: "dumbbell", strength: "dumbbell", home: "dumbbell",
      football: "trophy", basketball: "trophy", tennis: "sparkles",
      running: "footprints", steps: "footprints",
      cycling: "bike",
      swimming: "waves",
      yoga: "heart", recovery: "heart",
      stretching: "wind",
      mobility: "activity",
      hiit: "zap",
      cardio: "heart-pulse",
      hiking: "mountain",
    };
    const m = map[iconId];
    return ICON_OPTIONS.find((i) => i.id === m);
  })();
  const Icon = (preset ?? fallback)?.icon ?? Activity;
  return <Icon size={size} color={color} />;
}
