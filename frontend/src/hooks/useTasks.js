/**
 * Custom Hooks for Task Operations
 * Encapsulate API interactions and state management
 */

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  fetchTasksFiltered,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  selectLoading,
  selectError,
} from "../redux/slices/taskSlice";

/**
 * Hook for loading all tasks on component mount
 */
export const useLoadTasks = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const load = () => {
    dispatch(fetchTasks());
  };

  return { load, loading, error };
};

/**
 * Hook for creating a new task
 */
export const useCreateTask = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  const create = (taskData) => {
    return dispatch(createTask(taskData));
  };

  return { create, error };
};

/**
 * Hook for updating a task
 */
export const useUpdateTask = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  const update = (id, updates) => {
    return dispatch(updateTask({ id, updates }));
  };

  return { update, error };
};

/**
 * Hook for deleting a task
 */
export const useDeleteTask = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  const remove = (id) => {
    return dispatch(deleteTask(id));
  };

  return { remove, error };
};

/**
 * Hook for searching tasks
 */
export const useSearchTasks = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const search = (query) => {
    dispatch(searchTasks(query));
  };

  return { search, loading, error };
};

/**
 * Hook for filtering tasks
 */
export const useFilterTasks = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const filter = (column, priority) => {
    dispatch(fetchTasksFiltered({ column, priority }));
  };

  return { filter, loading, error };
};
