import type { IApiClient } from "./apiClient";
import type { UserProfile } from "@/types/domain";
import { todayISO } from "@/lib/store";

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

  setCurrentStreak(streak: number): void {
    this.api.write("user", { ...this.get(), currentStreak: streak });
  }

  setLongestStreak(streak: number): void {
    this.api.write("user", { ...this.get(), longestStreak: streak });
  }

  setLastActivityDate(date: string): void {
    this.api.write("user", { ...this.get(), lastActivityDate: date });
  }

  /**
   * Updates the streak based on activity completion.
   * - If last activity was yesterday: increment streak
   * - If last activity was today: no change
   * - Otherwise: reset to 1
   */
  updateStreak(today: string): void {
    const user = this.get();
    const lastDate = user.lastActivityDate ? user.lastActivityDate.slice(0, 10) : null;
    let newStreak = user.currentStreak ?? 0;

    if (lastDate === today) {
      // Already has activity today, no change
      return;
      
    } else {
      // Check if last activity was yesterday
      const yesterday = todayISO(-1)

      if (lastDate === yesterday) {
        // Consecutive day, increment
        newStreak = newStreak  + 1;
      } else {
        // Gap in streak, reset to 0
        newStreak = 0;
      }
    }

    // Update current streak
    this.setCurrentStreak(newStreak);

    // Update longest streak if needed
    const longestStreak = user.longestStreak ?? 0;
    if (newStreak > longestStreak) {
      this.setLongestStreak(newStreak);
    }

    // Update last activity date
    this.setLastActivityDate(today);
  }
}
