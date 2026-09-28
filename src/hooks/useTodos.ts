import { useState, useEffect } from 'react';
import { Todo, FormState } from '../types';
import { apiFetch } from '../lib/api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Todo[]>('/api/tasks')
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch((err) => {
        console.error('Failed to load tasks', err);
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getTodo = (id: string) => todos.find(t => t.id === id);

  const addTodo = (formState: FormState) => {
    const payload = {
      title: formState.title,
      description: formState.description,
      status: formState.status,
      priority: formState.priority,
      tags: formState.tags,
      dueDate: formState.dueDate || undefined,
    };
    apiFetch<Todo>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      .then((newTodo) => setTodos(prev => [newTodo, ...prev]))
      .catch((err) => console.error('Failed to create task', err));
  };

  const updateTodo = (id: string, changes: Partial<Todo>) => {
    apiFetch<Todo>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
    })
      .then((updated) => setTodos(prev => prev.map(t => (t.id === id ? updated : t))))
      .catch((err) => console.error('Failed to update task', err));
  };

  const deleteTodo = (id: string) => {
    apiFetch(`/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
      .catch((err) => console.error('Failed to delete task', err));
  };

  return { todos, getTodo, addTodo, updateTodo, deleteTodo, isLoaded };
}
