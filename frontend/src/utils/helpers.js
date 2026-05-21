/**
 * Utility Functions for Kanban Board
 */

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Get priority color style
 * @param {string} priority - Priority level (Low, Medium, High)
 * @returns {object} Tailwind color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    'Low': 'bg-blue-100 text-blue-800 border-blue-300',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'High': 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[priority] || colors['Medium'];
};

/**
 * Get column display name and color
 * @param {string} column - Column ID (todo, inProgress, done)
 * @returns {object} Column metadata
 */
export const getColumnInfo = (column) => {
  const columnInfo = {
    'todo': {
      name: 'To Do',
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
    },
    'inProgress': {
      name: 'In Progress',
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
    },
    'done': {
      name: 'Done',
      color: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
    },
  };
  return columnInfo[column] || columnInfo['todo'];
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate task data
 * @param {object} taskData - Task data to validate
 * @returns {object} Validation result with errors array
 */
export const validateTask = (taskData) => {
  const errors = [];

  if (!taskData.title || taskData.title.trim() === '') {
    errors.push('Title is required');
  }

  if (taskData.title && taskData.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (taskData.description && taskData.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  const validPriorities = ['Low', 'Medium', 'High'];
  if (taskData.priority && !validPriorities.includes(taskData.priority)) {
    errors.push('Invalid priority level');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sort tasks by property
 * @param {array} tasks - Array of tasks
 * @param {string} sortBy - Property to sort by (priority, createdAt)
 * @param {string} order - Sort order (asc, desc)
 * @returns {array} Sorted tasks
 */
export const sortTasks = (tasks, sortBy = 'createdAt', order = 'desc') => {
  const sorted = [...tasks];

  sorted.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'priority') {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      aVal = priorityOrder[aVal] || 0;
      bVal = priorityOrder[bVal] || 0;
    }

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return sorted;
};
