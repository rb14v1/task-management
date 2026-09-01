import React from 'react';
import { Todo, Priority, TodoStatus } from '../types';
import Badge from './Badge';
import StatusBadge from './StatusBadge';

interface TodoCardLocalProps {
  todo: Todo;
  onClick?: () => void;
  onStatusChange?: (id: string, status: TodoStatus) => void;
  onDelete?: (id: string) => void;
}

const priorityVariantMap: Record<Priority, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'success',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
};

const TodoCard: React.FC<TodoCardLocalProps> = ({ todo, onClick, onStatusChange, onDelete }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-800 flex-1 line-clamp-2">{todo.title}</h3>
        <StatusBadge status={todo.status} />
      </div>

      {todo.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{todo.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge variant={priorityVariantMap[todo.priority as Priority]}>
          {todo.priority}
        </Badge>
        {todo.tags.map((tag: string) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>

      {todo.dueDate && (
        <p className="text-xs text-gray-400 mb-3">Due: {todo.dueDate}</p>
      )}

      <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
        {onStatusChange && todo.status !== 'done' && (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => onStatusChange(todo.id, 'done')}
          >
            Mark Done
          </button>
        )}
        {onDelete && (
          <button
            className="text-xs text-red-500 hover:underline"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoCard;