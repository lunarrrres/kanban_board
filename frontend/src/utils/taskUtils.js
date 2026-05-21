// ─────────────────────────────────────────────────────────────
// taskUtils.js — бізнес-логіка Kanban-дошки (без UI та Redux)
// Винесена окремо, щоб її можна було покрити юніт-тестами.
// ─────────────────────────────────────────────────────────────

// ── Константи ────────────────────────────────────────────────

export const COLUMNS = ["todo", "inProgress", "done"];
export const PRIORITIES = ["low", "medium", "high"];

// ── Форматування дати ─────────────────────────────────────────

/**
 * Форматує ISO-рядок або об'єкт Date у вигляд "DD.MM.YYYY".
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// ── Пріоритет ─────────────────────────────────────────────────

/**
 * Повертає числовий вага пріоритету (для сортування).
 * high → 3, medium → 2, low → 1, невідомий → 0
 * @param {string} priority
 * @returns {number}
 */
export function getPriorityWeight(priority) {
  const map = { high: 3, medium: 2, low: 1 };
  return map[priority] ?? 0;
}

/**
 * Сортує масив завдань від найвищого до найнижчого пріоритету.
 * Не мутує оригінальний масив.
 * @param {Array} tasks
 * @returns {Array}
 */
export function sortByPriority(tasks) {
  return [...tasks].sort(
    (a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority),
  );
}

// ── Фільтрація ────────────────────────────────────────────────

/**
 * Фільтрує завдання за пошуковим рядком (по заголовку, без урахування регістру).
 * @param {Array}  tasks
 * @param {string} query
 * @returns {Array}
 */
export function filterBySearch(tasks, query) {
  if (!query || !query.trim()) return tasks;
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(q));
}

/**
 * Фільтрує завдання за пріоритетом.
 * Якщо priority === 'all' — повертає всі завдання.
 * @param {Array}  tasks
 * @param {string} priority  'all' | 'low' | 'medium' | 'high'
 * @returns {Array}
 */
export function filterByPriority(tasks, priority) {
  if (!priority || priority === "all") return tasks;
  return tasks.filter((t) => t.priority === priority);
}

/**
 * Фільтрує завдання за колонкою.
 * Якщо column === 'all' — повертає всі завдання.
 * @param {Array}  tasks
 * @param {string} column  'all' | 'todo' | 'inProgress' | 'done'
 * @returns {Array}
 */
export function filterByColumn(tasks, column) {
  if (!column || column === "all") return tasks;
  return tasks.filter((t) => t.column === column);
}

// ── Статистика дошки ──────────────────────────────────────────

/**
 * Підраховує кількість завдань у кожній колонці.
 * @param {Array} tasks
 * @returns {{ todo: number, inProgress: number, done: number }}
 */
export function getBoardStats(tasks) {
  return tasks.reduce(
    (acc, task) => {
      if (acc[task.column] !== undefined) acc[task.column]++;
      return acc;
    },
    { todo: 0, inProgress: 0, done: 0 },
  );
}

/**
 * Обчислює відсоток виконаних завдань (колонка 'done').
 * @param {Array} tasks
 * @returns {number}  0–100
 */
export function getCompletionPercent(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.column === "done").length;
  return Math.round((done / tasks.length) * 100);
}

// ── Валідація ─────────────────────────────────────────────────

/**
 * Перевіряє, чи є об'єкт валідним завданням.
 * Повертає масив рядків з помилками (порожній масив = OK).
 * @param {object} task
 * @returns {string[]}
 */
export function validateTask(task) {
  const errors = [];
  if (!task || typeof task !== "object") return ["Task must be an object"];
  if (!task.title || !task.title.trim()) errors.push("Title is required");
  if (task.title && task.title.trim().length > 100)
    errors.push("Title must be 100 characters or fewer");
  if (!COLUMNS.includes(task.column))
    errors.push(`Column must be one of: ${COLUMNS.join(", ")}`);
  if (!PRIORITIES.includes(task.priority))
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}`);
  return errors;
}
