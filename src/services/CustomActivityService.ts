import type { IApiClient } from "./apiClient";
import { uid } from "./apiClient";
import type { CustomActivity, NewCustomActivity } from "@/types/domain";

export class CustomActivityService {
  constructor(private api: IApiClient) {}

  list(): CustomActivity[] {
    return this.api.read("customActivities");
  }

  create(input: NewCustomActivity): CustomActivity {
    const item: CustomActivity = { ...input, id: uid() };
    this.api.write("customActivities", [...this.list(), item]);
    return item;
  }

  delete(id: string): void {
    this.api.write(
      "customActivities",
      this.list().filter((c) => c.id !== id),
    );
  }
}
