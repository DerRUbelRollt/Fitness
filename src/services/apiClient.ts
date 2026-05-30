// API client abstraction.
//
// The app talks to a single `IApiClient` for all persistence concerns.
// Today this is backed by localStorage (LocalStorageApiClient), but the
// interface is shaped like a REST repository so it can be swapped for a
// real HTTP client (e.g. fetch wrapper hitting /api/...) without touching
// any UI component or service consumer.

import type { SeedSnapshot } from "@/data/seed";
import { buildSeedSnapshot } from "@/data/seed";

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

const STORAGE_KEY = "fitflow.store.v2";

export class LocalStorageApiClient implements IApiClient {
  private state: SeedSnapshot;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = this.load();
  }

  private load(): SeedSnapshot {
    if (typeof window === "undefined") return buildSeedSnapshot();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as SeedSnapshot;
    } catch {
      /* ignore */
    }
    const seed = buildSeedSnapshot();
    this.persist(seed);
    return seed;
  }

  private persist(state: SeedSnapshot) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  read<K extends EntityKey>(key: K): SeedSnapshot[K] {
    return this.state[key];
  }

  write<K extends EntityKey>(key: K, value: SeedSnapshot[K]): void {
    this.state = { ...this.state, [key]: value };
    this.persist(this.state);
    this.emit();
  }

  reset(): SeedSnapshot {
    this.state = buildSeedSnapshot();
    this.persist(this.state);
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

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
