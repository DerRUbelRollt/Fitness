// Composition root for the service layer.
//
// A single IApiClient instance is shared by all services so that any
// mutation triggers one notification to subscribers (the store/React).
// To switch to a real HTTP backend, replace `LocalStorageApiClient`
// with a `HttpApiClient` implementing the same `IApiClient` interface.

import { LocalStorageApiClient, type IApiClient } from "./apiClient";
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
  const api = new LocalStorageApiClient();
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
