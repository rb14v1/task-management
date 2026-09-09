import { useParams, useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import TodoDetailForm from '../components/TodoDetailForm';
import { Todo } from '../types';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTodo, updateTodo, deleteTodo } = useTodos();
  const todo = id ? getTodo(id) : null;

  if (!todo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Task not found</h1>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (updated: Todo) => {
    updateTodo(todo.id, updated);
    navigate('/');
  };

  const handleDelete = (taskId: string) => {
    deleteTodo(taskId);
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Task</h1>
          <TodoDetailForm
            todo={todo}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}