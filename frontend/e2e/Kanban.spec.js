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
      page.getByRole("heading", { name: "Kanban Board" }),
    ).toBeVisible();

    // Перевіряємо колонки через heading — уникаємо дублів у статистиці внизу
    await expect(
      page.getByRole("heading", { name: /To Do/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /In Progress/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Done/i }).first(),
    ).toBeVisible();
  });
});

// ── Сценарій 2: Додавання завдання ───────────────────────────
test.describe("Додавання завдання", () => {
  test("користувач може додати нове завдання через форму", async ({ page }) => {
    await page.goto("/");

    // Натискаємо кнопку "Нове завдання" (Board.jsx)
    await page.getByRole("button", { name: "Нове завдання" }).click();

    // Чекаємо поки модалка відкриється (h2 у TaskForm.jsx)
    await expect(
      page.getByRole("heading", { name: "Нове завдання" }),
    ).toBeVisible();

    // Генеруємо унікальну назву щоб уникнути дублів від попередніх запусків
    const uniqueTitle = `E2E завдання ${Date.now()}`;

    // Заповнюємо форму (placeholders з TaskForm.jsx)
    await page.getByPlaceholder("Введіть назву завдання").fill(uniqueTitle);
    await page
      .getByPlaceholder("Додайте деталі завдання...")
      .fill("Опис тестового завдання");

    // Натискаємо "Зберегти"
    await page.getByRole("button", { name: "Зберегти" }).click();

    // Чекаємо закриття модалки
    await expect(
      page.getByRole("heading", { name: "Нове завдання" }),
    ).toBeHidden();

    // Перевіряємо що завдання з'явилось на дошці
    await expect(page.getByText(uniqueTitle)).toBeVisible();
  });
});
