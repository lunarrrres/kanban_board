/**
 * Task Controller - Handles business logic for tasks
 * Acts as intermediary between routes and models
 */

const Task = require('../models/Task');

/**
 * Get all tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTasks = (req, res) => {
  try {
    const tasks = Task.getAllTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
};

/**
 * Get single task by ID
 * @param {Object} req - Express request object with id param
 * @param {Object} res - Express response object
 */
const getTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const task = Task.findTaskById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task', details: error.message });
  }
};

/**
 * Create new task
 * @param {Object} req - Express request with task data in body
 * @param {Object} res - Express response object
 */
const createTask = (req, res) => {
  try {
    const { title, description, priority, column } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const validColumns = ['todo', 'inProgress', 'done'];
    if (column && !validColumns.includes(column)) {
      return res.status(400).json({ error: 'Invalid column' });
    }

    const newTask = Task.createTask({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'Medium',
      column: column || 'todo',
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
};

/**
 * Update existing task
 * @param {Object} req - Express request with id param and updates in body
 * @param {Object} res - Express response object
 */
const updateTask = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validation for priority if provided
    if (updates.priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(updates.priority)) {
        return res.status(400).json({ error: 'Invalid priority level' });
      }
    }

    // Validation for column if provided
    if (updates.column) {
      const validColumns = ['todo', 'inProgress', 'done'];
      if (!validColumns.includes(updates.column)) {
        return res.status(400).json({ error: 'Invalid column' });
      }
    }

    const updatedTask = Task.updateTask(id, updates);

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
};

/**
 * Delete task by ID
 * @param {Object} req - Express request with id param
 * @param {Object} res - Express response object
 */
const deleteTask = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = Task.deleteTask(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
};

/**
 * Get tasks by column
 * @param {Object} req - Express request with column query param
 * @param {Object} res - Express response object
 */
const getTasksByColumn = (req, res) => {
  try {
    const { column } = req.query;

    if (!column) {
      return res.status(400).json({ error: 'Column parameter is required' });
    }

    const validColumns = ['todo', 'inProgress', 'done'];
    if (!validColumns.includes(column)) {
      return res.status(400).json({ error: 'Invalid column' });
    }

    const tasks = Task.getTasksByColumn(column);
    res.json({
      success: true,
      count: tasks.length,
      column,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
};

/**
 * Get tasks by priority
 * @param {Object} req - Express request with priority query param
 * @param {Object} res - Express response object
 */
const getTasksByPriority = (req, res) => {
  try {
    const { priority } = req.query;

    if (!priority) {
      return res.status(400).json({ error: 'Priority parameter is required' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const tasks = Task.getTasksByPriority(priority);
    res.json({
      success: true,
      count: tasks.length,
      priority,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
  }
};

/**
 * Search tasks by title or description
 * @param {Object} req - Express request with search query param
 * @param {Object} res - Express response object
 */
const searchTasks = (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const tasks = Task.searchTasks(q);
    res.json({
      success: true,
      count: tasks.length,
      query: q,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search tasks', details: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByColumn,
  getTasksByPriority,
  searchTasks,
};
