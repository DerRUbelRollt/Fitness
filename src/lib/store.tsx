import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ScheduledActivity = {
  id: string;
  presetId?: string;
  customId?: string;
  title: string;
  color: string;
  icon: string;
  date: string; // ISO YYYY-MM-DD
  startTime?: string; // HH:mm
  durationMin: number;
  completed: boolean;
  notes?: string;
};

export type CustomActivity = {
  id: string;
  label: string;
  color: string;
  iconId: string;
};

export type Goal = {
  id: string;
  title: string;
  target: number;
  unit: string;
  period: "day" | "week" | "month";
  activityFilter?: string; // presetId or customId
  createdAt: string;
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  // map of date -> done
  log: Record<string, boolean>;
};

type Store = {
  activities: ScheduledActivity[];
  customActivities: CustomActivity[];
  goals: Goal[];
  habits: Habit[];
  userName: string;
  setUserName: (n: string) => void;
  addActivity: (a: Omit<ScheduledActivity, "id" | "completed">) => void;
  updateActivity: (id: string, patch: Partial<ScheduledActivity>) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  moveActivity: (id: string, newDate: string) => void;
  addCustomActivity: (a: Omit<CustomActivity, "id">) => void;
  deleteCustomActivity: (id: string) => void;
  addGoal: (g: Omit<Goal, "id" | "createdAt">) => void;
  deleteGoal: (id: string) => void;
  addHabit: (h: Omit<Habit, "id" | "createdAt" | "log">) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  resetAll: () => void;
};

const StoreContext = createContext<Store | null>(null);

const KEY = "fitflow.store.v1";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function seedData(): Pick<Store, "activities" | "customActivities" | "goals" | "habits" | "userName"> {
  const today = new Date();
  const iso = (off: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + off);
    return d.toISOString().slice(0, 10);
  };

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

  // Build seeded habit logs (last 40 days, mostly done)
  const log: Record<string, boolean> = {};
  for (let i = 0; i < 45; i++) {
    log[iso(-i)] = Math.random() > 0.25;
  }
  const log2: Record<string, boolean> = {};
  for (let i = 0; i < 45; i++) {
    log2[iso(-i)] = Math.random() > 0.35;
  }
  const log3: Record<string, boolean> = {};
  for (let i = 0; i < 45; i++) {
    log3[iso(-i)] = Math.random() > 0.4;
  }

  const habits: Habit[] = [
    { id: uid(), name: "2L Wasser trinken", emoji: "💧", color: "#38bdf8", createdAt: new Date().toISOString(), log },
    { id: uid(), name: "8 Stunden Schlaf", emoji: "🌙", color: "#a78bfa", createdAt: new Date().toISOString(), log: log2 },
    { id: uid(), name: "Stretching", emoji: "🧘", color: "#f0abfc", createdAt: new Date().toISOString(), log: log3 },
    { id: uid(), name: "Kein Zucker", emoji: "🚫", color: "#fb7185", createdAt: new Date().toISOString(), log: {} },
  ];

  return { activities, customActivities: [], goals, habits, userName: "Alex" };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return seedData();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seedData();
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api = useMemo<Store>(() => ({
    ...state,
    setUserName: (userName: string) => setState((s: any) => ({ ...s, userName })),
    addActivity: (a) => setState((s: any) => ({ ...s, activities: [...s.activities, { ...a, id: uid(), completed: false }] })),
    updateActivity: (id, patch) => setState((s: any) => ({
      ...s, activities: s.activities.map((x: ScheduledActivity) => x.id === id ? { ...x, ...patch } : x)
    })),
    deleteActivity: (id) => setState((s: any) => ({ ...s, activities: s.activities.filter((x: ScheduledActivity) => x.id !== id) })),
    toggleActivityComplete: (id) => setState((s: any) => ({
      ...s, activities: s.activities.map((x: ScheduledActivity) => x.id === id ? { ...x, completed: !x.completed } : x)
    })),
    moveActivity: (id, newDate) => setState((s: any) => ({
      ...s, activities: s.activities.map((x: ScheduledActivity) => x.id === id ? { ...x, date: newDate } : x)
    })),
    addCustomActivity: (a) => setState((s: any) => ({ ...s, customActivities: [...s.customActivities, { ...a, id: uid() }] })),
    deleteCustomActivity: (id) => setState((s: any) => ({ ...s, customActivities: s.customActivities.filter((x: CustomActivity) => x.id !== id) })),
    addGoal: (g) => setState((s: any) => ({ ...s, goals: [...s.goals, { ...g, id: uid(), createdAt: new Date().toISOString() }] })),
    deleteGoal: (id) => setState((s: any) => ({ ...s, goals: s.goals.filter((x: Goal) => x.id !== id) })),
    addHabit: (h) => setState((s: any) => ({ ...s, habits: [...s.habits, { ...h, id: uid(), createdAt: new Date().toISOString(), log: {} }] })),
    toggleHabit: (id, date) => setState((s: any) => ({
      ...s,
      habits: s.habits.map((h: Habit) =>
        h.id === id ? { ...h, log: { ...h.log, [date]: !h.log[date] } } : h
      ),
    })),
    deleteHabit: (id) => setState((s: any) => ({ ...s, habits: s.habits.filter((h: Habit) => h.id !== id) })),
    resetAll: () => setState(seedData()),
  }), [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { todayISO };
