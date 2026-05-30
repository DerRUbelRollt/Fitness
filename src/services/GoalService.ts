import { parseISO, startOfWeek } from "date-fns";
import type { IApiClient } from "./apiClient";
import { uid, todayISO } from "./apiClient";
import type { Goal, NewGoal, ScheduledActivity, UserProfile } from "@/types/domain";

export class GoalService {
  constructor(private api: IApiClient) {}

  list(): Goal[] {
    return this.api.read("goals");
  }

  create(input: NewGoal): Goal {
    const goal: Goal = { ...input, id: uid(), createdAt: new Date().toISOString() };
    this.api.write("goals", [...this.list(), goal]);
    return goal;
  }

  delete(id: string): void {
    this.api.write("goals", this.list().filter((g) => g.id !== id));
  }

  /** Compute current progress for a goal based on completed activities. */
  computeProgress(goal: Goal, activities: ScheduledActivity[], user?: UserProfile): number {
    const now = new Date();
    let start: Date;
    if (goal.period === "day") start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    else if (goal.period === "week") start = startOfWeek(now, { weekStartsOn: 1 });
    else start = new Date(now.getFullYear(), now.getMonth(), 1);

    const inRange = activities.filter((a) => {
      const d = parseISO(a.date);
      return (
        d >= start &&
        d <= now &&
        a.completed &&
        (!goal.activityFilter ||
          a.presetId === goal.activityFilter ||
          a.customId === goal.activityFilter)
      );
    });

    // Spezialbehandlung für verschiedene Units
    if (goal.unit === "Minuten") return inRange.reduce((s, a) => s + a.durationMin, 0);
    if (goal.unit === "Schritte") {
      // Summiere Steps aus Aktivitäten + manuell eingetragene Schritte vom Benutzer
      const stepsFromActivities = inRange.reduce((s, a) => s + (a.steps ?? 0), 0);
      const today = todayISO();
      const userStepsToday = goal.period === "day" && user?.stepsToday ? user.stepsToday : 0;
      return stepsFromActivities + userStepsToday;
    }

    return inRange.length;
  }
}
