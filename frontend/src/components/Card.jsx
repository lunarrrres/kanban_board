/**
 * Card Component - Individual task card in Kanban board
 * Displays task info and provides actions for edit/delete
 */

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { formatDate, getPriorityColor, truncateText } from "../utils/helpers";

const Card = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-lg shadow-md p-4 mb-3 cursor-move
            transition-all duration-200
            ${snapshot.isDragging ? "shadow-lg scale-105 bg-gray-50" : "hover:shadow-lg"}
            border-l-4 border-indigo-500
          `}
        >
          {/* Priority Badge */}
          <div className="flex justify-between items-start mb-2">
            <span
              className={`
                inline-block px-2 py-1 text-xs font-semibold rounded
                ${getPriorityColor(task.priority)}
              `}
            >
              {task.priority}
            </span>
          </div>

          {/* Task Title */}
          <h3 className="font-bold text-gray-800 mb-2 text-sm">
            {truncateText(task.title, 40)}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {truncateText(task.description, 60)}
            </p>
          )}

          {/* Created Date */}
          <div className="text-xs text-gray-500 mb-3">
            {formatDate(task.createdAt)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="
                flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs
                font-semibold py-1 px-2 rounded transition-colors duration-200
              "
              title="Edit task"
            >
              Редаг.
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="
                flex-1 bg-red-500 hover:bg-red-600 text-white text-xs
                font-semibold py-1 px-2 rounded transition-colors duration-200
              "
              title="Delete task"
            >
              Видал.
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
