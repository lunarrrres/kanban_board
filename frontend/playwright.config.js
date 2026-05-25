// playwright.config.js
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e", // ← тільки ця папка
  use: {
    baseURL: "http://127.0.0.1:5174",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 5174",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
  },
});
