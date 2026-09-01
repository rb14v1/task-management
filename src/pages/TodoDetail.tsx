import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Todo } from '../types';
import { useTodos } from '../hooks/useLocalStorage';
import TodoDetailForm from '../components/TodoDetailForm';

const TodoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [saved, setSaved] = useState(false);

  const todo: Todo | undefined = todos.find((t) => t.id === id);

  if (!todo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Task not found.</p>
        <button className="mt-4 text-blue-600 hover:underline" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleSave = (updated: Todo) => {
    updateTodo(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (todoId: string) => {
    deleteTodo(todoId);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button className="text-blue-600 hover:underline text-sm" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Task Detail</h1>
        {saved && <span className="text-green-600 text-sm">Saved!</span>}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TodoDetailForm
          todo={todo}
          onSave={handleSave}
          onCancel={() => navigate('/')}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default TodoDetail;