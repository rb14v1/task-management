import React, { useState } from 'react';
import { Todo, TodoDetailFormProps, FormState, Priority, TodoStatus } from '../types';
import Button from './Button';

const statusOptions: TodoStatus[] = ['todo', 'in-progress', 'done', 'archived'];
const priorityOptions: Priority[] = ['low', 'medium', 'high', 'urgent'];

const TodoDetailForm: React.FC<TodoDetailFormProps> = ({ todo, onSave, onCancel, onDelete }) => {
  const [form, setForm] = useState<FormState>({
    title: todo.title,
    description: todo.description ?? '',
    status: todo.status,
    priority: todo.priority,
    tags: todo.tags,
    dueDate: todo.dueDate ?? '',
  });

  const handleChange = (field: keyof FormState, value: string | string[]) => {
    setForm((prev: FormState) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Todo = {
      ...todo,
      ...form,
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = (e.currentTarget.value ?? '').trim();
      if (val && !form.tags.includes(val)) {
        handleChange('tags', [...form.tags, val]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tag: string) => {
    handleChange('tags', form.tags.filter((t: string) => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (press Enter to add)</label>
        <input
          type="text"
          onKeyDown={handleTagInput}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a tag..."
        />
        <div className="flex gap-1 flex-wrap mt-2">
          {form.tags.map((tag: string) => (
            <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <div>
          {onDelete && (
            <Button type="button" variant="danger" onClick={() => onDelete(todo.id)}>
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </div>
      </div>
    </form>
  );
};

export default TodoDetailForm;