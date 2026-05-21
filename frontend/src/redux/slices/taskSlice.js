/**
 * Redux Slice: Task Management
 * Handles all task state and async operations
 * Centralized state management following Redux Toolkit best practices
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

/**
 * Async Thunks - Handle API calls
 */

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/tasks`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

// Fetch tasks with filters
export const fetchTasksFiltered = createAsyncThunk(
  'tasks/fetchTasksFiltered',
  async ({ column, priority }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (column) params.append('column', column);
      if (priority) params.append('priority', priority);

      const response = await axios.get(`${API_BASE}/tasks?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

// Search tasks by query
export const searchTasks = createAsyncThunk(
  'tasks/searchTasks',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/tasks?q=${query}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/tasks`, taskData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE}/tasks/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

/**
 * Redux Slice Definition
 */
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    // Task data organized by column
    columnOrder: ['todo', 'inProgress', 'done'],
    tasks: {
      'todo': [],
      'inProgress': [],
      'done': []
    },
    // Filter and search state
    filters: {
      priority: null,
      searchQuery: ''
    },
    // UI state
    loading: false,
    error: null,
    editingTaskId: null,
  },

  // Synchronous actions
  reducers: {
    /**
     * Move task between columns (used for drag-and-drop)
     */
    moveTask: (state, action) => {
      const { taskId, sourceColumn, destinationColumn } = action.payload;

      // Find and remove task from source column
      const taskIndex = state.tasks[sourceColumn].findIndex(t => t.id === taskId);
      if (taskIndex === -1) return;

      const [movedTask] = state.tasks[sourceColumn].splice(taskIndex, 1);

      // Add task to destination column
      state.tasks[destinationColumn].push(movedTask);
    },

    /**
     * Reorder tasks within the same column
     */
    reorderTasks: (state, action) => {
      const { column, tasks } = action.payload;
      state.tasks[column] = tasks;
    },

    /**
     * Set priority filter
     */
    setPriorityFilter: (state, action) => {
      state.filters.priority = action.payload;
    },

    /**
     * Set search query
     */
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },

    /**
     * Clear all filters
     */
    clearFilters: (state) => {
      state.filters.priority = null;
      state.filters.searchQuery = '';
    },

    /**
     * Set editing task ID
     */
    setEditingTaskId: (state, action) => {
      state.editingTaskId = action.payload;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
  },

  // Asynchronous actions handlers
  extraReducers: (builder) => {
    // ==================== FETCH ALL TASKS ====================
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      // Organize tasks by column
      const organized = {
        'todo': [],
        'inProgress': [],
        'done': []
      };
      action.payload.forEach(task => {
        if (organized[task.column]) {
          organized[task.column].push(task);
        }
      });
      state.tasks = organized;
    });

    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ==================== FETCH FILTERED TASKS ====================
    builder.addCase(fetchTasksFiltered.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchTasksFiltered.fulfilled, (state, action) => {
      state.loading = false;
      const organized = {
        'todo': [],
        'inProgress': [],
        'done': []
      };
      action.payload.forEach(task => {
        if (organized[task.column]) {
          organized[task.column].push(task);
        }
      });
      state.tasks = organized;
    });

    builder.addCase(fetchTasksFiltered.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ==================== SEARCH TASKS ====================
    builder.addCase(searchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(searchTasks.fulfilled, (state, action) => {
      state.loading = false;
      const organized = {
        'todo': [],
        'inProgress': [],
        'done': []
      };
      action.payload.forEach(task => {
        if (organized[task.column]) {
          organized[task.column].push(task);
        }
      });
      state.tasks = organized;
    });

    builder.addCase(searchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ==================== CREATE TASK ====================
    builder.addCase(createTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      const { column } = action.payload;
      if (state.tasks[column]) {
        state.tasks[column].push(action.payload);
      }
    });

    builder.addCase(createTask.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ==================== UPDATE TASK ====================
    builder.addCase(updateTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      // Find and update the task in its column
      state.columnOrder.forEach(column => {
        const taskIndex = state.tasks[column].findIndex(t => t.id === updatedTask.id);
        if (taskIndex !== -1) {
          state.tasks[column][taskIndex] = updatedTask;
        }
      });
    });

    builder.addCase(updateTask.rejected, (state, action) => {
      state.error = action.payload;
    });

    // ==================== DELETE TASK ====================
    builder.addCase(deleteTask.pending, (state) => {
      state.error = null;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const taskId = action.payload;
      // Remove task from all columns
      state.columnOrder.forEach(column => {
        state.tasks[column] = state.tasks[column].filter(t => t.id !== taskId);
      });
    });

    builder.addCase(deleteTask.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});

// Export actions
export const {
  moveTask,
  reorderTasks,
  setPriorityFilter,
  setSearchQuery,
  clearFilters,
  setEditingTaskId,
  clearError,
} = taskSlice.actions;

// Selectors for easy state access
export const selectAllTasks = (state) => {
  const allTasks = [];
  state.tasks.columnOrder.forEach(column => {
    allTasks.push(...state.tasks.tasks[column]);
  });
  return allTasks;
};

export const selectTasksByColumn = (column) => (state) => {
  return state.tasks.tasks[column] || [];
};

export const selectLoading = (state) => state.tasks.loading;
export const selectError = (state) => state.tasks.error;
export const selectFilters = (state) => state.tasks.filters;
export const selectEditingTaskId = (state) => state.tasks.editingTaskId;

// Export reducer
export default taskSlice.reducer;
