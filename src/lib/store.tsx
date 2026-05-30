// React binding for the service layer.
//
// `useStore` is intentionally kept as the public hook so UI components
// don't need to know about service classes — they call `addActivity`,
// `toggleHabit`, etc. and receive reactive arrays. Under the hood, every
// call delegates to a service, which talks to the IApiClient, which then
// notifies React via a subscription.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getServices, todayISO } from "@/services";
import type {
  CustomActivity,
  Goal,
  Habit,
  NewCustomActivity,
  NewGoal,
  NewHabit,
  NewScheduledActivity,
  ScheduledActivity,
} from "@/types/domain";

// Re-export domain types for back-compat with existing imports.
export type { ScheduledActivity, CustomActivity, Goal, Habit } from "@/types/domain";
export { todayISO };

interface StoreValue {
  activities: ScheduledActivity[];
  customActivities: CustomActivity[];
  goals: Goal[];
  habits: Habit[];
  userName: string;
  setUserName: (n: string) => void;
  addActivity: (a: NewScheduledActivity) => void;
  updateActivity: (id: string, patch: Partial<ScheduledActivity>) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  moveActivity: (id: string, newDate: string) => void;
  addCustomActivity: (a: NewCustomActivity) => void;
  deleteCustomActivity: (id: string) => void;
  addGoal: (g: NewGoal) => void;
  deleteGoal: (id: string) => void;
  addHabit: (h: NewHabit) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => getServices(), []);
  const [, setVersion] = useState(0);

  useEffect(() => {
    return services.api.subscribe(() => setVersion((v) => v + 1));
  }, [services]);

  const snapshot = services.api.snapshot();

  const value = useMemo<StoreValue>(
    () => ({
      activities: snapshot.activities,
      customActivities: snapshot.customActivities,
      goals: snapshot.goals,
      habits: snapshot.habits,
      userName: snapshot.user.name,
      setUserName: (n) => services.user.setName(n),
      addActivity: (a) => services.activities.create(a),
      updateActivity: (id, patch) => services.activities.update(id, patch),
      deleteActivity: (id) => services.activities.delete(id),
      toggleActivityComplete: (id) => services.activities.toggleComplete(id),
      moveActivity: (id, date) => services.activities.move(id, date),
      addCustomActivity: (a) => services.customActivities.create(a),
      deleteCustomActivity: (id) => services.customActivities.delete(id),
      addGoal: (g) => services.goals.create(g),
      deleteGoal: (id) => services.goals.delete(id),
      addHabit: (h) => services.habits.create(h),
      toggleHabit: (id, date) => services.habits.toggle(id, date),
      deleteHabit: (id) => services.habits.delete(id),
      resetAll: () => {
        services.api.reset();
      },
    }),
    [services, snapshot],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Convenience hook for components that need direct service access. */
export function useServices() {
  return useMemo(() => getServices(), []);
}
