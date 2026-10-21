import { defineConfig, devices } from "@playwright/test";

// The browser suite runs against an isolated dev server on an ephemeral port,
// never the developer's own Vite or preview ports.
const BASE_URL = "http://localhost:11010";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  reporter: "list",
  // External map assets must not be able to hang the run.
  timeout: 120_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 11010 --strictPort",
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
