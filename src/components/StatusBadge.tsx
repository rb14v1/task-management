import React from 'react';
import { TodoStatus } from '../types';
import Badge from './Badge';

const statusConfig: Record<TodoStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' }> = {
  'todo': { label: 'Todo', variant: 'default' },
  'in-progress': { label: 'In Progress', variant: 'info' },
  'done': { label: 'Done', variant: 'success' },
  'archived': { label: 'Archived', variant: 'warning' },
};

interface StatusBadgeProps {
  status: TodoStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] ?? { label: status, variant: 'default' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default StatusBadge;