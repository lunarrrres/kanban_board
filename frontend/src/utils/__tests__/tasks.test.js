// ─────────────────────────────────────────────────────────────
// src/utils/__tests__/tasks.test.js
// Тести бізнес-логіки Kanban-дошки (Vitest)
// Разом: 23 тести у 6 групах
// ─────────────────────────────────────────────────────────────

import { describe, test, expect } from "vitest";

import {
  formatDate,
  sortByPriority,
  filterBySearch,
  filterByPriority,
  filterByColumn,
  getBoardStats,
  getCompletionPercent,
  validateTask,
} from "../taskUtils.js";

// ── Хелпер ───────────────────────────────────────────────────
const makeTask = (overrides = {}) => ({
  id: "1",
  title: "Test task",
  description: "",
  priority: "medium",
  column: "todo",
  createdAt: "2024-01-15T10:00:00.000Z",
  ...overrides,
});

// ══════════════════════════════════════════════════════════════
// 1. formatDate
// ══════════════════════════════════════════════════════════════
describe("formatDate", () => {
  test("1. повертає дату у форматі DD.MM.YYYY з ISO-рядка", () => {
    expect(formatDate("2024-01-15T10:00:00.000Z")).toMatch(
      /^\d{2}\.\d{2}\.\d{4}$/
    );
  });

  test("2. коректно форматує конкретний місяць та рік", () => {
    const result = formatDate(new Date("2024-03-07T00:00:00.000Z"));
    expect(result).toMatch(/^\d{2}\.03\.2024$/);
  });

  test('3. повертає "Invalid date" для некоректного рядка', () => {
    expect(formatDate("not-a-date")).toBe("Invalid date");
  });
});

// ══════════════════════════════════════════════════════════════
// 2. sortByPriority
// ══════════════════════════════════════════════════════════════
describe("sortByPriority", () => {
  const tasks = [
    makeTask({ id: "1", priority: "low" }),
    makeTask({ id: "2", priority: "high" }),
    makeTask({ id: "3", priority: "medium" }),
  ];

  test("4. сортує від high до low", () => {
    const sorted = sortByPriority(tasks);
    expect(sorted.map((t) => t.priority)).toEqual(["high", "medium", "low"]);
  });

  test("5. не мутує оригінальний масив", () => {
    const copy = [...tasks];
    sortByPriority(tasks);
    expect(tasks).toEqual(copy);
  });

  test("6. порожній масив повертає порожній масив", () => {
    expect(sortByPriority([])).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
// 3. filterBySearch та filterByPriority
// ══════════════════════════════════════════════════════════════
describe("filterBySearch та filterByPriority", () => {
  const tasks = [
    makeTask({ id: "1", title: "Fix login bug", priority: "high" }),
    makeTask({ id: "2", title: "Write unit tests", priority: "medium" }),
    makeTask({ id: "3", title: "Update README", priority: "low" }),
  ];

  test("7. filterBySearch — знаходить за частиною заголовку без урахування регістру", () => {
    const result = filterBySearch(tasks, "login");
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Fix login bug");
  });

  test("8. filterBySearch — повертає всі при порожньому запиті", () => {
    expect(filterBySearch(tasks, "")).toHaveLength(3);
    expect(filterBySearch(tasks, "   ")).toHaveLength(3);
  });

  test('9. filterByPriority — фільтр "all" повертає всі завдання', () => {
    expect(filterByPriority(tasks, "all")).toHaveLength(3);
  });

  test('10. filterByPriority — фільтр "high" повертає тільки high', () => {
    const result = filterByPriority(tasks, "high");
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("high");
  });

  test('11. filterByPriority — фільтр "low" повертає тільки low', () => {
    const result = filterByPriority(tasks, "low");
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("low");
  });
});

// ══════════════════════════════════════════════════════════════
// 4. filterByColumn — покриває рядки 87-88 taskUtils.js
// ══════════════════════════════════════════════════════════════
describe("filterByColumn", () => {
  const tasks = [
    makeTask({ id: "1", column: "todo" }),
    makeTask({ id: "2", column: "inProgress" }),
    makeTask({ id: "3", column: "done" }),
    makeTask({ id: "4", column: "todo" }),
  ];

  test('12. фільтр "all" повертає всі завдання', () => {
    expect(filterByColumn(tasks, "all")).toHaveLength(4);
  });

  test('13. фільтрує завдання за колонкою "todo"', () => {
    const result = filterByColumn(tasks, "todo");
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.column === "todo")).toBe(true);
  });

  test("14. повертає всі завдання якщо column не передано", () => {
    expect(filterByColumn(tasks, "")).toHaveLength(4);
  });
});

// ══════════════════════════════════════════════════════════════
// 5. getBoardStats та getCompletionPercent
// ══════════════════════════════════════════════════════════════
describe("getBoardStats та getCompletionPercent", () => {
  const tasks = [
    makeTask({ id: "1", column: "todo" }),
    makeTask({ id: "2", column: "todo" }),
    makeTask({ id: "3", column: "inProgress" }),
    makeTask({ id: "4", column: "done" }),
  ];

  test("15. getBoardStats — підраховує кількість завдань у кожній колонці", () => {
    expect(getBoardStats(tasks)).toEqual({ todo: 2, inProgress: 1, done: 1 });
  });

  test("16. getCompletionPercent — 0% при порожньому списку", () => {
    expect(getCompletionPercent([])).toBe(0);
  });

  test("17. getCompletionPercent — коректно обчислює 25%", () => {
    expect(getCompletionPercent(tasks)).toBe(25);
  });

  test('18. getCompletionPercent — 100% коли всі завдання у "done"', () => {
    const allDone = tasks.map((t) => ({ ...t, column: "done" }));
    expect(getCompletionPercent(allDone)).toBe(100);
  });
});

// ══════════════════════════════════════════════════════════════
// 6. validateTask
// ══════════════════════════════════════════════════════════════
describe("validateTask", () => {
  test("19. валідне завдання повертає порожній масив помилок", () => {
    expect(
      validateTask(
        makeTask({ title: "Valid task", priority: "high", column: "todo" })
      )
    ).toEqual([]);
  });

  test("20. повертає помилку при відсутньому заголовку", () => {
    expect(validateTask(makeTask({ title: "" }))).toContain(
      "Title is required"
    );
  });

  test("21. повертає помилку при невалідній колонці", () => {
    const errors = validateTask(makeTask({ column: "backlog" }));
    expect(errors.some((e) => e.includes("Column"))).toBe(true);
  });

  test("22. повертає помилку при невалідному пріоритеті", () => {
    const errors = validateTask(makeTask({ priority: "urgent" }));
    expect(errors.some((e) => e.includes("Priority"))).toBe(true);
  });

  test("23. повертає помилку при заголовку понад 100 символів", () => {
    const errors = validateTask(makeTask({ title: "A".repeat(101) }));
    expect(errors.some((e) => e.includes("100"))).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════
// 7. Покриття гілок — рядки 38, 101, 129
// ══════════════════════════════════════════════════════════════
import { getPriorityWeight } from "../taskUtils.js";

describe("Покриття гілок (branch coverage)", () => {
  test("24. getPriorityWeight — повертає 0 для невідомого пріоритету (рядок 38: ?? 0)", () => {
    expect(getPriorityWeight("unknown")).toBe(0);
    expect(getPriorityWeight(undefined)).toBe(0);
  });

  test("25. getBoardStats — ігнорує завдання з неіснуючою колонкою (рядок 101: else-гілка)", () => {
    const tasks = [
      makeTask({ id: "1", column: "todo" }),
      makeTask({ id: "2", column: "invalidColumn" }), // не потрапляє в лічильник
    ];
    expect(getBoardStats(tasks)).toEqual({ todo: 1, inProgress: 0, done: 0 });
  });

  test("26. validateTask — повертає помилку якщо передано не обʼєкт (рядок 129)", () => {
    expect(validateTask(null)).toEqual(["Task must be an object"]);
    expect(validateTask("string")).toEqual(["Task must be an object"]);
  });
});
