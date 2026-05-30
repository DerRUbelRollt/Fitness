import type { IApiClient } from "./apiClient";
import { uid } from "./apiClient";
import type { NewScheduledActivity, ScheduledActivity } from "@/types/domain";

export class ActivityService {
  constructor(private api: IApiClient) {}

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
    this.api.write(
      "activities",
      this.list().map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
    );
  }

  move(id: string, date: string): void {
    this.update(id, { date });
  }
}
