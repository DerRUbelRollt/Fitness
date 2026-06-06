// Mock seed data used as a fallback when the backend is unreachable.
// In normal operation data is fetched from the REST backend via HttpApiClient.

import type {
  ScheduledActivity,
  CustomActivity,
  Goal,
  Habit,
  UserProfile,
} from "@/types/domain";

export interface SeedSnapshot {
  user: UserProfile;
  activities: ScheduledActivity[];
  customActivities: CustomActivity[];
  goals: Goal[];
  habits: Habit[];
}

export function buildSeedSnapshot(): SeedSnapshot {
  return { 
    user: { 
      name: "", 
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: undefined,
      stepsToday: 0,
      stepsGoal: 10000,
      calorieToday: 0,
      calorieGoal: 2100,
      minutesGoal: 60
    }, 
    activities: [], 
    customActivities: [], 
    goals: [], 
    habits: [] 
  };
}
