// Mock seed data used by the LocalStorageApiClient on first launch
// and by the "Reset" action. In a real backend setup this would be
// fetched from the server instead.

import type {
  ScheduledActivity,
  Goal,
  Habit,
  CustomActivity,
  UserProfile,
} from "@/types/domain";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function iso(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export interface SeedSnapshot {
  user: UserProfile;
  activities: ScheduledActivity[];
  customActivities: CustomActivity[];
  goals: Goal[];
  habits: Habit[];
}

export function buildSeedSnapshot(): SeedSnapshot {
  const activities: ScheduledActivity[] = [
    { id: uid(), presetId: "gym", title: "Gym – Push Day", color: "#4ade80", icon: "dumbbell", date: iso(-2), startTime: "07:30", durationMin: 70, completed: true },
    { id: uid(), presetId: "running", title: "Morning Run", color: "#34d399", icon: "footprints", date: iso(-1), startTime: "06:45", durationMin: 35, completed: true },
    { id: uid(), presetId: "football", title: "Fußballtraining", color: "#22d3ee", icon: "trophy", date: iso(0), startTime: "18:00", durationMin: 90, completed: false },
    { id: uid(), presetId: "yoga", title: "Yoga Flow", color: "#a78bfa", icon: "heart", date: iso(0), startTime: "07:00", durationMin: 25, completed: true },
    { id: uid(), presetId: "cycling", title: "Bike Tour", color: "#60a5fa", icon: "bike", date: iso(1), startTime: "10:00", durationMin: 60, completed: false },
    { id: uid(), presetId: "strength", title: "Pull Day", color: "#4ade80", icon: "dumbbell", date: iso(2), startTime: "07:30", durationMin: 60, completed: false },
    { id: uid(), presetId: "hiit", title: "HIIT 20", color: "#facc15", icon: "zap", date: iso(3), startTime: "18:30", durationMin: 25, completed: false },
    { id: uid(), presetId: "swimming", title: "Schwimmen", color: "#38bdf8", icon: "waves", date: iso(4), startTime: "08:00", durationMin: 45, completed: false },
    { id: uid(), presetId: "recovery", title: "Regenerationstag", color: "#94a3b8", icon: "heart", date: iso(5), durationMin: 30, completed: false },
  ];

  const goals: Goal[] = [
    { id: uid(), title: "4× Gym pro Woche", target: 4, unit: "Einheiten", period: "week", activityFilter: "gym", createdAt: new Date().toISOString() },
    { id: uid(), title: "Täglich 10k Schritte", target: 10000, unit: "Schritte", period: "day", createdAt: new Date().toISOString() },
    { id: uid(), title: "3× Fußballtraining", target: 3, unit: "Einheiten", period: "week", activityFilter: "football", createdAt: new Date().toISOString() },
    { id: uid(), title: "300 Min Sport / Woche", target: 300, unit: "Minuten", period: "week", createdAt: new Date().toISOString() },
  ];

  const mkLog = (probability: number) => {
    const log: Record<string, boolean> = {};
    for (let i = 0; i < 45; i++) log[iso(-i)] = Math.random() > probability;
    return log;
  };

  const habits: Habit[] = [
    { id: uid(), name: "2L Wasser trinken", emoji: "💧", color: "#38bdf8", createdAt: new Date().toISOString(), log: mkLog(0.25) },
    { id: uid(), name: "8 Stunden Schlaf", emoji: "🌙", color: "#a78bfa", createdAt: new Date().toISOString(), log: mkLog(0.35) },
    { id: uid(), name: "Stretching", emoji: "🧘", color: "#f0abfc", createdAt: new Date().toISOString(), log: mkLog(0.4) },
    { id: uid(), name: "Kein Zucker", emoji: "🚫", color: "#fb7185", createdAt: new Date().toISOString(), log: {} },
  ];

  return { user: { name: "Alex" }, activities, customActivities: [], goals, habits };
}
