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
}
