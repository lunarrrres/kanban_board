/**
 * Board Component - Main Kanban Board
 * Orchestrates all components and manages drag-and-drop functionality
 * Feature-based structure: features/board/Board.jsx
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import Column from "../../components/Column";
import TaskForm from "../tasks/TaskForm";
import SearchBar from "../tasks/SearchBar";
import {
  fetchTasks,
  searchTasks,
  fetchTasksFiltered,
  moveTask,
  selectAllTasks,
  selectLoading,
  selectError,
} from "../../redux/slices/taskSlice";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "../../hooks/useTasks";

const Board = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const tasks = useSelector((state) => state.tasks.tasks);

  const { create: createTask } = useCreateTask();
  const { update: updateTask } = useUpdateTask();
  const { remove: deleteTask } = useDeleteTask();

  // Local state for UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Load tasks on component mount
   */
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  /**
   * Handle drag and drop completion
   * Updates task position in Redux state and API
   */
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside valid area, do nothing
    if (!destination) return;

    // If dropped in same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const taskId = draggableId;

    // Update local state immediately for better UX
    dispatch(
      moveTask({
        taskId,
        sourceColumn,
        destinationColumn: destColumn,
      }),
    );

    // Update on backend if column changed
    if (sourceColumn !== destColumn) {
      updateTask(taskId, { column: destColumn });
    }
  };

  /**
   * Handle edit task button click
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  /**
   * Handle delete task button click
   */
  const handleDeleteTask = (taskId) => {
    if (window.confirm("Ви впевнені, що хочете видалити це завдання?")) {
      deleteTask(taskId);
    }
  };

  /**
   * Handle add new task button click
   */
  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  /**
   * Handle form submission (create or update)
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
        });
      } else {
        // Create new task
        await createTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          column: formData.column,
        });
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query) => {
    dispatch(searchTasks(query));
  };

  /**
   * Handle priority filter
   */
  const handleFilterPriority = (priority) => {
    dispatch(fetchTasksFiltered({ priority }));
  };

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    dispatch(fetchTasks());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Kanban Board
              </h1>
              <p className="text-gray-600">Управляйте завданнями ефективно</p>
            </div>
            <button
              onClick={handleAddNewTask}
              disabled={loading}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              Нове завдання
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
            <span>Помилка: {error}</span>
            <button
              onClick={handleClearFilters}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
            Завантаження завдань...
          </div>
        )}

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilterPriority={handleFilterPriority}
          onClearFilters={handleClearFilters}
          isLoading={loading}
        />

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {/* Columns */}
            {["todo", "inProgress", "done"].map((columnId) => (
              <Column
                key={columnId}
                columnId={columnId}
                tasks={tasks[columnId] || []}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Stats */}
        {!loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {tasks["todo"]?.length || 0}
              </div>
              <div className="text-gray-600">Завдань в To Do</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {tasks["inProgress"]?.length || 0}
              </div>
              <div className="text-gray-600">В процесі виконання</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {tasks["done"]?.length || 0}
              </div>
              <div className="text-gray-600">Завершених</div>
            </div>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Board;
