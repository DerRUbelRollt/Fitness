// Domain model types — shared between services, store, and UI components.
// These are the single source of truth for the shape of data flowing through
// the app. Service classes return these types; UI components consume them.

export interface ScheduledActivity {
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
}

export interface CustomActivity {
  id: string;
  label: string;
  color: string;
  iconId: string;
}

export type GoalPeriod = "day" | "week" | "month";

export interface Goal {
  id: string;
  title: string;
  target: number;
  unit: string;
  period: GoalPeriod;
  activityFilter?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: string;
  log: Record<string, boolean>;
}

export interface UserProfile {
  name: string;
}

export interface ActivityPresetData {
  id: string;
  label: string;
  iconId: string;
  color: string;
  defaultDurationMin: number;
}

// Input DTOs (what UI passes to services when creating/updating)
export type NewScheduledActivity = Omit<ScheduledActivity, "id" | "completed">;
export type NewCustomActivity = Omit<CustomActivity, "id">;
export type NewGoal = Omit<Goal, "id" | "createdAt">;
export type NewHabit = Omit<Habit, "id" | "createdAt" | "log">;
