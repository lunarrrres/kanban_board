/**
 * Task Model - Handles data persistence
 * Uses JSON file as database (easily replaceable with MongoDB)
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../../data/tasks.json');

/**
 * Ensure data directory and file exist
 */
const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
};

/**
 * Read all tasks from JSON file
 * @returns {Array} Array of all tasks
 */
const getAllTasks = () => {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
};

/**
 * Save tasks to JSON file
 * @param {Array} tasks - Array of tasks to save
 */
const saveTasks = (tasks) => {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
};

/**
 * Find task by ID
 * @param {string} id - Task ID
 * @returns {Object|null} Task object or null if not found
 */
const findTaskById = (id) => {
  const tasks = getAllTasks();
  return tasks.find(task => task.id === id) || null;
};

/**
 * Create new task
 * @param {Object} taskData - Task properties
 * @returns {Object} Created task
 */
const createTask = (taskData) => {
  const tasks = getAllTasks();
  const newTask = {
    id: uuidv4(),
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority || 'Medium',
    column: taskData.column || 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

/**
 * Update existing task
 * @param {string} id - Task ID
 * @param {Object} updates - Updated properties
 * @returns {Object|null} Updated task or null if not found
 */
const updateTask = (id, updates) => {
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);

  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    id: tasks[taskIndex].id,
    createdAt: tasks[taskIndex].createdAt,
    updatedAt: new Date().toISOString(),
  };

  saveTasks(tasks);
  return tasks[taskIndex];
};

/**
 * Delete task by ID
 * @param {string} id - Task ID
 * @returns {boolean} True if deleted, false if not found
 */
const deleteTask = (id) => {
  const tasks = getAllTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);

  if (filteredTasks.length === tasks.length) return false;

  saveTasks(filteredTasks);
  return true;
};

/**
 * Get tasks by column
 * @param {string} column - Column name (todo, inProgress, done)
 * @returns {Array} Tasks in the specified column
 */
const getTasksByColumn = (column) => {
  const tasks = getAllTasks();
  return tasks.filter(task => task.column === column);
};

/**
 * Get tasks by priority
 * @param {string} priority - Priority level (Low, Medium, High)
 * @returns {Array} Tasks with specified priority
 */
const getTasksByPriority = (priority) => {
  const tasks = getAllTasks();
  return tasks.filter(task => task.priority === priority);
};

/**
 * Search tasks by title
 * @param {string} query - Search query
 * @returns {Array} Tasks matching search query
 */
const searchTasks = (query) => {
  const tasks = getAllTasks();
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery)
  );
};

module.exports = {
  getAllTasks,
  saveTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByColumn,
  getTasksByPriority,
  searchTasks,
};
