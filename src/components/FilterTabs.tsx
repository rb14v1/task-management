import React from 'react';
import { FilterBarProps, FilterType } from '../types';

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done', value: 'done' },
  { label: 'Archived', value: 'archived' },
];

const FilterTabs: React.FC<FilterBarProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === f.value
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;