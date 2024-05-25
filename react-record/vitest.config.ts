import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["vitest-canvas-mock"],
    },
    setupFiles: "./src/tests/setup.ts",
    css: true,
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
  },
});
