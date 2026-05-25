// ─────────────────────────────────────────────────────────────
// e2e/kanban.spec.js
// E2E тести для Kanban Board (Playwright + Chromium).
//   • Сценарій 1: Головна сторінка відкривається і відображає дошку
//   • Сценарій 2: Користувач може додати нове завдання через форму
// ─────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";

// ── Сценарій 1: Головна сторінка ─────────────────────────────
test.describe("Головна сторінка", () => {
  test("відкривається і відображає три колонки дошки", async ({ page }) => {
    await page.goto("/");

    // Перевіряємо заголовок дошки
    await expect(
      page.getByRole("heading", { name: "Kanban Board" })
    ).toBeVisible();

    // Перевіряємо колонки через heading — уникаємо дублів у статистиці внизу
    await expect(
      page.getByRole("heading", { name: /To Do/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /In Progress/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Done/i }).first()
    ).toBeVisible();
  });
});

// ── Сценарій 2: Додавання завдання ───────────────────────────
test.describe("Додавання завдання", () => {
  test("користувач може додати нове завдання через форму", async ({ page }) => {
    await page.goto("/");

    // Listen for API responses to debug
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/tasks") && response.status() === 201
    );

    await page.getByRole("button", { name: "+ Додати завдання" }).click();
    await expect(
      page.getByRole("heading", { name: "Нове завдання" })
    ).toBeVisible();

    const uniqueTitle = `E2E завдання ${Date.now()}`;
    await page.getByPlaceholder("Введіть назву завдання").fill(uniqueTitle);
    await page
      .getByPlaceholder("Додайте деталі завдання...")
      .fill("Опис тестового завдання");

    await page.getByRole("button", { name: "Зберегти" }).click();

    try {
      await responsePromise;
    } catch (e) {
      console.error("API call failed or timed out:", e);
    }

    await expect(
      page.getByRole("heading", { name: "Нове завдання" })
    ).toBeHidden();

    await page.waitForTimeout(500);

    await expect(page.getByText(uniqueTitle)).toBeVisible({ timeout: 10000 });
  });
});
