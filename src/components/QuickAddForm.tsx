import React from 'react';

export interface QuickAddFormProps {
  onAdd: (title: string) => void;
}

export default function QuickAddForm({ onAdd }: QuickAddFormProps) {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder="Add task..." />
      <button type="submit">Add</button>
    </form>
  );
}