/**
 * TaskForm Component - Modal form for creating/editing tasks
 * Handles task validation and submission
 */

import React, { useState, useEffect } from "react";
import { validateTask } from "../../utils/helpers";

const TaskForm = ({ task, isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    column: "todo",
  });

  const [errors, setErrors] = useState([]);

  // Populate form when editing task
  useEffect(() => {
    if (task) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        column: task.column,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        column: "todo",
      });
    }
    setErrors([]);
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateTask(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Submit form
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {task ? "Редагувати завдання" : "Нове завдання"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <ul className="list-disc list-inside">
                  {errors.map((error, idx) => (
                    <li key={idx} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Заголовок *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Введіть назву завдання"
                maxLength="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Опис
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Додайте деталі завдання..."
                maxLength="500"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={isLoading}
              />
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Пріоритет
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="Low">🟢 Низький (Low)</option>
                <option value="Medium">🟡 Середній (Medium)</option>
                <option value="High">🔴 Високий (High)</option>
              </select>
            </div>

            {/* Column Select */}
            {!task && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Колонка
                </label>
                <select
                  name="column"
                  value={formData.column}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="todo">📝 To Do</option>
                  <option value="inProgress">⏳ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                disabled={isLoading}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Обробка..." : "Зберегти"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TaskForm;
