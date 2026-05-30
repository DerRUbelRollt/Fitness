import type { IApiClient } from "./apiClient";
import type { UserProfile } from "@/types/domain";

export class UserService {
  constructor(private api: IApiClient) {}

  get(): UserProfile {
    return this.api.read("user");
  }

  setName(name: string): void {
    this.api.write("user", { ...this.get(), name });
  }

  setStepsToday(steps: number): void {
    this.api.write("user", { ...this.get(), stepsToday: steps });
  }

  setStepsGoal(steps: number): void {
    this.api.write("user", { ...this.get(), stepsGoal: steps });
  }

  setCalorieToday(cal: number): void {
    this.api.write("user", { ...this.get(), calorieToday: cal });
  }

  setCalorieGoal(cal: number): void {
    this.api.write("user", { ...this.get(), calorieGoal: cal });
  }

  setMinutesGoal(min: number): void {
    this.api.write("user", { ...this.get(), minutesGoal: min });
  }
}
