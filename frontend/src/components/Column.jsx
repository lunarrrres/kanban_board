/**
 * Column Component - Represents a column in the Kanban board
 * Contains draggable tasks organized by status
 */

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import Card from "./Card";
import { getColumnInfo } from "../utils/helpers";

const Column = ({ columnId, tasks, onEdit, onDelete }) => {
  const columnInfo = getColumnInfo(columnId);

  return (
    <div
      className={`
        ${columnInfo.color} rounded-lg p-4 flex flex-col min-h-screen
        flex-1 min-w-80 border-2 ${columnInfo.borderColor}
      `}
    >
      {/* Column Header */}
      <div className="mb-4">
        <h2
          className={`font-bold text-lg ${columnInfo.textColor} flex items-center gap-2`}
        >
          {columnInfo.name}
          <span className="bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
            {tasks.length}
          </span>
        </h2>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 rounded-lg transition-colors duration-200
              ${snapshot.isDraggingOver ? "bg-opacity-50 bg-blue-200" : ""}
              ${tasks.length === 0 ? "bg-white bg-opacity-30" : ""}
            `}
          >
            {/* Task Cards */}
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <Card
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <p className="text-center">
                  No tasks yet
                  <br />
                  <span className="text-sm">Додайте нові завдання </span>
                </p>
              </div>
            )}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
