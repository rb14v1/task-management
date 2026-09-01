export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoStatus = 'todo' | 'in-progress' | 'done' | 'archived';
export type FilterType = 'all' | TodoStatus;

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: Priority;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormState {
  title: string;
  description: string;
  status: TodoStatus;
  priority: Priority;
  tags: string[];
  dueDate: string;
}

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export interface TodoCardProps {
  todo: Todo;
  onClick?: () => void;
  onStatusChange?: (id: string, status: TodoStatus) => void;
  onDelete?: (id: string) => void;
}

export interface TodoDetailFormProps {
  todo: Todo;
  onSave: (todo: Todo) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

export interface TodoFormProps {
  onSave: (form: FormState) => void;
  onCancel: () => void;
  initialValues?: Partial<FormState>;
}

export interface QuickAddFormProps {
  onAdd: (form: FormState) => void;
}