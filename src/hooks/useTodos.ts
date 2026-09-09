import { useState, useEffect } from 'react';
import { Todo, TodoStatus, Priority, FormState } from '../types';

const STORAGE_KEY = 'task-management-todos';

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTodos(todos);
    }
  }, [todos, isLoaded]);

  const getTodo = (id: string) => todos.find(t => t.id === id);

  const addTodo = (formState: FormState) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: formState.title,
      description: formState.description,
      status: formState.status,
      priority: formState.priority,
      tags: formState.tags,
      dueDate: formState.dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
    return newTodo;
  };

  const updateTodo = (id: string, changes: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return { todos, getTodo, addTodo, updateTodo, deleteTodo, isLoaded };
}