import type { IApiClient } from "./apiClient";
import { uid } from "./apiClient";
import type { Habit, NewHabit } from "@/types/domain";

export class HabitService {
  constructor(private api: IApiClient) {}

  list(): Habit[] {
    return this.api.read("habits");
  }

  create(input: NewHabit): Habit {
    const habit: Habit = { ...input, id: uid(), createdAt: new Date().toISOString(), log: {} };
    this.api.write("habits", [...this.list(), habit]);
    return habit;
  }

  delete(id: string): void {
    this.api.write("habits", this.list().filter((h) => h.id !== id));
  }

  toggle(id: string, date: string): void {
    this.api.write(
      "habits",
      this.list().map((h) =>
        h.id === id ? { ...h, log: { ...h.log, [date]: !h.log[date] } } : h,
      ),
    );
  }
}
