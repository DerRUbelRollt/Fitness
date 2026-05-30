// HTTP-backed implementation of IApiClient.
//
// Talks to a REST backend (e.g. a future Quarkus + PostgreSQL service)
// over fetch. The base URL is configured via `VITE_API_URL`.
//
// Contract (per resource — activities, goals, habits, custom-activities):
//   GET    /<resource>         → list
//   POST   /<resource>         → create   (body: full entity incl. id)
//   PUT    /<resource>/{id}    → update   (body: full entity)
//   DELETE /<resource>/{id}    → delete
//
// User:
//   GET /user
//   PUT /user
//
// The interface IApiClient is intentionally synchronous so that the
// existing service/store layer keeps working without refactors. We hold
// an in-memory snapshot, bootstrap it asynchronously from the backend on
// startup, and reconcile every `write()` with the server by diffing the
// previous vs next collection and dispatching the matching REST calls.
//
// If the backend is unreachable at any point, we degrade gracefully:
//   • on bootstrap → keep the seed snapshot, log a console warning
//   • on mutation → keep the optimistic in-memory update, log the error
// The app stays fully functional; data simply does not persist.

import type { IApiClient, EntityKey } from "./apiClient";
import type { SeedSnapshot } from "@/data/seed";
import { buildSeedSnapshot } from "@/data/seed";
import type {
  CustomActivity,
  Goal,
  Habit,
  ScheduledActivity,
  UserProfile,
} from "@/types/domain";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 6000;

type AnyEntity = ScheduledActivity | Goal | Habit | CustomActivity;

const RESOURCE_PATH: Record<
  Exclude<EntityKey, "user">,
  string
> = {
  activities: "/activities",
  goals: "/goals",
  habits: "/habits",
  customActivities: "/custom-activities",
};

async function safeFetch(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await safeFetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return (await res.json()) as T;
}

async function sendJSON(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<void> {
  const res = await safeFetch(`${API_URL}${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
}

export class HttpApiClient implements IApiClient {
  private state: SeedSnapshot;
  private listeners = new Set<() => void>();
  private online = false;

  constructor() {
    // Start with seed so synchronous reads work before bootstrap resolves.
    this.state = buildSeedSnapshot();
    if (typeof window !== "undefined") {
      void this.bootstrap();
    }
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private async bootstrap() {
    if (!API_URL) {
      console.warn("Backend unavailable. Running in seed-data mode.");
      return;
    }
    try {
      const [user, activities, goals, habits, customActivities] = await Promise.all([
        getJSON<UserProfile>("/user"),
        getJSON<ScheduledActivity[]>("/activities"),
        getJSON<Goal[]>("/goals"),
        getJSON<Habit[]>("/habits"),
        getJSON<CustomActivity[]>("/custom-activities"),
      ]);
      this.state = { user, activities, goals, habits, customActivities };
      this.online = true;
      this.emit();
    } catch (err) {
      console.warn("Backend unavailable. Running in seed-data mode.", err);
    }
  }

  read<K extends EntityKey>(key: K): SeedSnapshot[K] {
    return this.state[key];
  }

  write<K extends EntityKey>(key: K, value: SeedSnapshot[K]): void {
    const prev = this.state[key];
    this.state = { ...this.state, [key]: value };
    this.emit();
    // Reconcile with the backend in the background. If we're offline,
    // skip the network call but keep the optimistic in-memory update.
    if (this.online) {
      void this.sync(key, prev, value).catch((err) => {
        console.warn(`Failed to sync ${key} with backend.`, err);
      });
    }
  }

  private async sync<K extends EntityKey>(
    key: K,
    prev: SeedSnapshot[K],
    next: SeedSnapshot[K],
  ): Promise<void> {
    if (key === "user") {
      await sendJSON("PUT", "/user", next);
      return;
    }
    const path = RESOURCE_PATH[key as Exclude<EntityKey, "user">];
    const prevList = prev as AnyEntity[];
    const nextList = next as AnyEntity[];
    const prevById = new Map(prevList.map((e) => [e.id, e]));
    const nextById = new Map(nextList.map((e) => [e.id, e]));

    const tasks: Promise<void>[] = [];
    for (const entity of nextList) {
      const before = prevById.get(entity.id);
      if (!before) tasks.push(sendJSON("POST", path, entity));
      else if (JSON.stringify(before) !== JSON.stringify(entity))
        tasks.push(sendJSON("PUT", `${path}/${entity.id}`, entity));
    }
    for (const entity of prevList) {
      if (!nextById.has(entity.id))
        tasks.push(sendJSON("DELETE", `${path}/${entity.id}`));
    }
    await Promise.all(tasks);
  }

  reset(): SeedSnapshot {
    this.state = buildSeedSnapshot();
    this.emit();
    return this.state;
  }

  snapshot(): SeedSnapshot {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
