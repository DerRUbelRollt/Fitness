// PresetService exposes the catalog of built-in activity presets.
// Data lives in src/data/presets.json so it can later be served from
// a real backend; only the icon component mapping stays in code,
// since lucide components are not serializable.

import presetsJson from "@/data/presets.json";
import type { ActivityPresetData } from "@/types/domain";

export class PresetService {
  private presets: ActivityPresetData[];

  constructor(data: ActivityPresetData[] = presetsJson as ActivityPresetData[]) {
    this.presets = data;
  }

  list(): ActivityPresetData[] {
    return this.presets;
  }

  find(id: string): ActivityPresetData | undefined {
    return this.presets.find((p) => p.id === id);
  }
}
