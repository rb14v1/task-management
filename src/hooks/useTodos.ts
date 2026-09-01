import { useState } from 'react';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    setTodos(prev => [...prev, { id: Date.now(), title, completed: false }]);
  };

  const updateTodo = (id: number, changes: Partial<Todo>) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...changes } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return { todos, addTodo, updateTodo, deleteTodo };
}