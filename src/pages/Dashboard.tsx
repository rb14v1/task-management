import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import { Todo, FormState, TodoStatus, FilterType } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { todos, addTodo, updateTodo, deleteTodo, isLoaded } = useTodos();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(t => t.status === filter);

  const handleAddTodo = (formState: FormState) => {
    addTodo(formState);
    setShowForm(false);
  };

  const handleStatusChange = (id: string, status: TodoStatus) => {
    updateTodo(id, { status });
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
  };

  const handleEditTask = (id: string) => {
    navigate(`/task/${id}`);
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const statusOptions: FilterType[] = ['all', 'todo', 'in-progress', 'done', 'archived'];
  const stats = {
    total: todos.length,
    todo: todos.filter(t => t.status === 'todo').length,
    inProgress: todos.filter(t => t.status === 'in-progress').length,
    done: todos.filter(t => t.status === 'done').length,
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'done': 'bg-green-100 text-green-800',
      'archived': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">To Do</p>
            <p className="text-3xl font-bold text-gray-900">{stats.todo}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Done</p>
            <p className="text-3xl font-bold text-gray-900">{stats.done}</p>
          </div>
        </div>

        {/* Add Task Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Task</h2>
            <TodoForm
              onSave={handleAddTodo}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-4">
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No tasks found in this filter.</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div
                key={todo.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => handleEditTask(todo.id)}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{todo.title}</h3>
                    {todo.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{todo.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(todo.status)}`}>
                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).replace('-', ' ')}
                      </span>
                      {todo.dueDate && (
                        <span className="text-xs text-gray-600">
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {todo.tags && todo.tags.length > 0 && (
                        <div className="flex gap-1">
                          {todo.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                          {todo.tags.length > 2 && (
                            <span className="text-gray-600 text-xs">+{todo.tags.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={todo.status}
                      onChange={(e) => handleStatusChange(todo.id, e.target.value as TodoStatus)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      onClick={() => handleEditTask(todo.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}