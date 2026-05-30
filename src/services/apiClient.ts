// API client abstraction.
//
// The app talks to a single `IApiClient` for all persistence concerns.
// The concrete implementation is `HttpApiClient` (REST backend, e.g. a
// future Quarkus + PostgreSQL service). The interface is synchronous so
// services and the React store don't need to be `async`; the HTTP client
// keeps an in-memory snapshot and reconciles writes with the server in
// the background.
//
// If no backend is reachable, the client falls back to in-memory seed
// data so the UI stays usable during development.

import type { SeedSnapshot } from "@/data/seed";

export type EntityKey =
  | "user"
  | "activities"
  | "customActivities"
  | "goals"
  | "habits";

export interface IApiClient {
  read<K extends EntityKey>(key: K): SeedSnapshot[K];
  write<K extends EntityKey>(key: K, value: SeedSnapshot[K]): void;
  reset(): SeedSnapshot;
  snapshot(): SeedSnapshot;
  subscribe(listener: () => void): () => void;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
