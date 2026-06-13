import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: {
      host: true,
      port: 8080,
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});