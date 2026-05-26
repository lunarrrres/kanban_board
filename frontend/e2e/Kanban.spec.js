// ─────────────────────────────────────────────────────────────
// e2e/kanban.spec.js
// E2E тести для Kanban Board (Playwright + Chromium).
//   • Сценарій 1: Головна сторінка відкривається і відображає дошку
//   • Сценарій 2: Користувач може додати нове завдання через форму
// ─────────────────────────────────────────────────────────────

import { test, expect } from "@playwright/test";

async function signInWithFreshUser(page) {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "Password123!";

  await page.addInitScript(() => {
    window.localStorage.removeItem("kanban_auth_token");
    window.localStorage.removeItem("kanban_user");
  });

  const registerResponse = await page.request.post(
    "http://localhost:5000/api/auth/register",
    {
      data: {
        name: "E2E User",
        email,
        password,
      },
    }
  );

  expect(registerResponse.ok()).toBeTruthy();

  await page.goto("/");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Пароль").fill(password);
  await page.getByRole("button", { name: "Увійти" }).click();

  await expect(page.getByRole("heading", { name: "Kanban Board" })).toBeVisible(
    { timeout: 10000 }
  );
}

// ── Сценарій 1: Головна сторінка ─────────────────────────────
test.describe("Головна сторінка", () => {
  test("відкривається і відображає три колонки дошки", async ({ page }) => {
    await signInWithFreshUser(page);

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
    await signInWithFreshUser(page);

    // Listen for API responses to debug
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/tasks") && response.status() === 201,
      { timeout: 60000 }
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
