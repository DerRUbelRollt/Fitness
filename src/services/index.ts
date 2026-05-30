// Composition root for the service layer.
//
// A single IApiClient instance is shared by all services so that any
// mutation triggers one notification to subscribers (the store/React).
// The concrete implementation is HttpApiClient — to point the app at a
// different backend, set VITE_API_URL.

import { type IApiClient } from "./apiClient";
import { HttpApiClient } from "./HttpApiClient";
import { ActivityService } from "./ActivityService";
import { GoalService } from "./GoalService";
import { HabitService } from "./HabitService";
import { CustomActivityService } from "./CustomActivityService";
import { UserService } from "./UserService";
import { PresetService } from "./PresetService";

export interface Services {
  api: IApiClient;
  activities: ActivityService;
  goals: GoalService;
  habits: HabitService;
  customActivities: CustomActivityService;
  user: UserService;
  presets: PresetService;
}

let cached: Services | null = null;

export function getServices(): Services {
  if (cached) return cached;
  const api = new HttpApiClient();
  cached = {
    api,
    activities: new ActivityService(api),
    goals: new GoalService(api),
    habits: new HabitService(api),
    customActivities: new CustomActivityService(api),
    user: new UserService(api),
    presets: new PresetService(),
  };
  return cached;
}

export { todayISO } from "./apiClient";
export type { IApiClient };
