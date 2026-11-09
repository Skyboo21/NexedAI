// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "src/lib/**/*",
        "src/schemas/**/*",
        "src/services/**/*",
        "src/store/**/*",
        "app/api/**/*",
      ],
      exclude: [
        "node_modules/**",
        ".next/**",
        "coverage/**",
        "**/*.d.ts",
        "tests/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
});
