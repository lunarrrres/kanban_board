/**
 * Task Routes - Defines all API endpoints for task management
 * RESTful API following standard conventions
 */

const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

/**
 * GET /api/tasks - Get all tasks
 * Query params:
 *   - column: Filter by column (todo, inProgress, done)
 *   - priority: Filter by priority (Low, Medium, High)
 *   - q: Search query
 */
router.get('/', (req, res, next) => {
  const { column, priority, q } = req.query;

  // Route to appropriate handler based on query parameters
  if (column) {
    return taskController.getTasksByColumn(req, res);
  }
  if (priority) {
    return taskController.getTasksByPriority(req, res);
  }
  if (q) {
    return taskController.searchTasks(req, res);
  }

  taskController.getAllTasks(req, res);
});

/**
 * POST /api/tasks - Create new task
 * Body: { title, description?, priority?, column? }
 */
router.post('/', taskController.createTask);

/**
 * GET /api/tasks/:id - Get task by ID
 * Params: id (task UUID)
 */
router.get('/:id', taskController.getTaskById);

/**
 * PATCH /api/tasks/:id - Update task
 * Params: id (task UUID)
 * Body: { title?, description?, priority?, column? }
 */
router.patch('/:id', taskController.updateTask);

/**
 * DELETE /api/tasks/:id - Delete task
 * Params: id (task UUID)
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
