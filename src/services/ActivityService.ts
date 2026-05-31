import type { IApiClient } from "./apiClient";
import { uid, todayISO } from "./apiClient";
import type { NewScheduledActivity, ScheduledActivity } from "@/types/domain";
import type { UserService } from "./UserService";

export class ActivityService {
  constructor(private api: IApiClient, private userService: UserService) {}

  list(): ScheduledActivity[] {
    return this.api.read("activities");
  }

  create(input: NewScheduledActivity): ScheduledActivity {
    const activity: ScheduledActivity = { ...input, id: uid(), completed: false };
    this.api.write("activities", [...this.list(), activity]);
    return activity;
  }

  update(id: string, patch: Partial<ScheduledActivity>): void {
    this.api.write(
      "activities",
      this.list().map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }

  delete(id: string): void {
    this.api.write("activities", this.list().filter((a) => a.id !== id));
  }

  toggleComplete(id: string): void {
    const activity = this.list().find((a) => a.id === id);
    if (!activity) return;

    const wasCompleted = activity.completed;
    const today = todayISO();

    // Toggle the activity
    this.api.write(
      "activities",
      this.list().map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
    );

    // Update streak only when completing an activity for today
    if (!wasCompleted && activity.date === today) {
      this.userService.updateStreak(today);
    }
  }

  move(id: string, date: string): void {
    this.update(id, { date });
  }
}
