/**
 * SearchBar Component - Search and filter tasks
 * Provides search input and priority filters
 */

import React, { useState } from "react";

const SearchBar = ({
  onSearch,
  onFilterPriority,
  onClearFilters,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      onClearFilters();
    } else {
      onSearch(value);
    }
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value;
    setSelectedPriority(value);

    if (value === "") {
      onClearFilters();
    } else {
      onFilterPriority(value);
    }
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedPriority("");
    onClearFilters();
  };

  const hasFilters = searchQuery.trim() !== "" || selectedPriority !== "";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Пошук по назві завдання..."
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Priority Filter */}
        <div className="md:w-48">
          <select
            value={selectedPriority}
            onChange={handlePriorityChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Всі пріоритети</option>
            <option value="Low">🟢 Низький</option>
            <option value="Medium">🟡 Середній</option>
            <option value="High">🔴 Високий</option>
          </select>
        </div>

        {/* Clear Button */}
        {hasFilters && (
          <button
            onClick={handleClearAll}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50"
          >
            ✕ Очистити
          </button>
        )}
      </div>

      {/* Active Filters Info */}
      {hasFilters && (
        <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200 text-sm text-gray-600">
          Активні фільтри:
          {searchQuery && ` Пошук "${searchQuery}"`}
          {searchQuery && selectedPriority && " •"}
          {selectedPriority && ` Пріоритет "${selectedPriority}"`}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
