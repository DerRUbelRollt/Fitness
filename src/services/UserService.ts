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
   * - If last activity was today: only ensure streak is at least 1
   * - Otherwise: reset to 1
   */
  updateStreak(today: string): void {
    const user = this.get();
    const lastDate = user.lastActivityDate ? user.lastActivityDate.slice(0, 10) : null;

    console.log("🔥 updateStreak called:", {
      today,
      lastDate,
      currentStreak: user.currentStreak,
      lastActivityDate: user.lastActivityDate,
    });

    let newStreak = user.currentStreak ?? 0;
    const yesterday = todayISO(-1);

    if (lastDate === today) {
      // Already completed activity today
      // But ensure streak is at least 1 (in case of initialization issue)
      if (newStreak === 0) {
        console.log("⚠️ Activity today but streak is 0, setting to 1");
        newStreak = 1;
      } else {
        console.log("⏭️ Already has activity today, no change");
        return;
      }
    } else if (lastDate === yesterday) {
      // Consecutive day, increment streak
      newStreak = newStreak + 1;
      console.log("⬆️ Consecutive day! New streak:", newStreak);
    } else {
      // Gap in streak, reset to 1
      newStreak = 1;
      console.log("🔄 Gap in streak, reset to 1");
    }

    // Update current streak
    console.log("💾 Saving streak:", newStreak);
    this.setCurrentStreak(newStreak);

    // Update longest streak if needed
    const longestStreak = user.longestStreak ?? 0;
    if (newStreak > longestStreak) {
      console.log("🏆 New longest streak:", newStreak);
      this.setLongestStreak(newStreak);
    }

    // Update last activity date
    this.setLastActivityDate(today);
    console.log("✅ Streak updated successfully!");
  }
}
