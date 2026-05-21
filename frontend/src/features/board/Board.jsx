/**
 * Board Component - Main Kanban Board
 * Orchestrates all components and manages drag-and-drop functionality
 */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../../components/Column";
import TaskForm from "../tasks/TaskForm";
import SearchBar from "../tasks/SearchBar";
import {
  fetchTasks,
  searchTasks,
  fetchTasksFiltered,
  moveTask,
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

  // Виправляємо доступ до tasks: додаємо пустий об'єкт як fallback
  const tasks = useSelector((state) => state.tasks.tasks) || {
    todo: [],
    inProgress: [],
    done: [],
  };

  const { create: createTask } = useCreateTask();
  const { update: updateTask } = useUpdateTask();
  const { remove: deleteTask } = useDeleteTask();

  // Local state for UI
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Отримання змінних оточення з безпечними значеннями за замовчуванням
  const isProd = import.meta.env.PROD;
  const mode = isProd ? "PRODUCTION" : "DEVELOPMENT";
  const title = import.meta.env.VITE_APP_TITLE || "Kanban Board";

  /**
   * Load tasks on component mount
   */
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  /**
   * Handle drag and drop completion
   */
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destColumn = destination.droppableId;
    const taskId = draggableId;

    // Оптимістичне оновлення Redux
    dispatch(
      moveTask({
        taskId,
        sourceColumn,
        destinationColumn: destColumn,
      }),
    );

    // Синхронізація з бекендом
    if (sourceColumn !== destColumn) {
      updateTask(taskId, { column: destColumn });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Ви впевнені, що хочете видалити це завдання?")) {
      deleteTask(taskId);
    }
  };

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (query) => {
    dispatch(searchTasks(query));
  };

  const handleFilterPriority = (priority) => {
    dispatch(fetchTasksFiltered({ priority }));
  };

  const handleClearFilters = () => {
    dispatch(fetchTasks());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section з використанням системних змінних */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  {title}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isProd
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  [{mode} MODE]
                </span>
              </div>
              {/* <p className="text-gray-500 font-medium">
                Професійне управління вашими завданнями
              </p> */}
            </div>

            <button
              onClick={handleAddNewTask}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              + Додати завдання
            </button>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold">Помилка:</span> {error}
            </div>
            <button
              onClick={handleClearFilters}
              className="hover:rotate-90 transition-transform"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            onFilterPriority={handleFilterPriority}
            onClearFilters={handleClearFilters}
            isLoading={loading}
          />
        </div>

        {/* Kanban Board Area */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
            {["todo", "inProgress", "done"].map((columnId) => (
              <div key={columnId} className="snap-center">
                <Column
                  columnId={columnId}
                  tasks={tasks[columnId] || []}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Statistics Section */}
        {!loading && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: "В черзі",
                count: tasks.todo?.length,
                color: "text-gray-600",
              },
              {
                label: "В роботі",
                count: tasks.inProgress?.length,
                color: "text-blue-600",
              },
              {
                label: "Завершено",
                count: tasks.done?.length,
                color: "text-green-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white text-center"
              >
                <div className={`text-3xl font-black ${stat.color}`}>
                  {stat.count || 0}
                </div>
                <div className="text-sm font-semibold text-gray-400 uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
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
