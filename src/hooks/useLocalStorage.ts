import { useState, useEffect } from 'react';
import { Todo, TodoStatus, FilterType } from '../types';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [filter, setFilter] = useLocalStorage<FilterType>('filter', 'all');

  const addTodo = (data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prev: Todo[]) => [newTodo, ...prev]);
  };

  const updateTodo = (updated: Todo) => {
    setTodos((prev: Todo[]) =>
      prev.map((t: Todo) => (t.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));
  };

  const updateStatus = (id: string, status: TodoStatus) => {
    setTodos((prev: Todo[]) =>
      prev.map((t: Todo) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
  };

  const filteredTodos = filter === 'all' ? todos : todos.filter((t: Todo) => t.status === filter);

  return { todos, filteredTodos, filter, setFilter, addTodo, updateTodo, deleteTodo, updateStatus };
}

export default useLocalStorage;