// Mock seed data used as a fallback when the backend is unreachable
// and by the "Reset" action. In normal operation data is fetched from
// the REST backend via HttpApiClient.

import type {
  ScheduledActivity,
  Goal,
  Habit,
  CustomActivity,
  UserProfile,
} from "@/types/domain";

let _seq = 0;
function uid() {
  _seq += 1;
  return `seed-${_seq.toString(36)}`;
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
  ];

  const goals: Goal[] = [
    { id: uid(), title: "4× Gym pro Woche", target: 4, unit: "Einheiten", period: "week", activityFilter: "gym", createdAt: new Date().toISOString() },
    { id: uid(), title: "Täglich 10k Schritte", target: 10000, unit: "Schritte", period: "day", createdAt: new Date().toISOString() },
    { id: uid(), title: "2× Fußballtraining", target: 2, unit: "Einheiten", period: "week", activityFilter: "football", createdAt: new Date().toISOString() },
  ];

  const mkLog = (skip: number) => {
    const log: Record<string, boolean> = {};
    for (let i = 0; i < 45; i++) log[iso(-i)] = i % skip !== 0;
    return log;
  };

  const habits: Habit[] = [
  ];

  return { 
    user: { 
      name: "Max Rubel", 
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: undefined,
      stepsToday: 0,
      stepsGoal: 10000,
      calorieToday: 0,
      calorieGoal: 2100,
      minutesGoal: 60
    }, 
    activities, 
    customActivities: [], 
    goals, 
    habits 
  };
}
