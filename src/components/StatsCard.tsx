import React from 'react';
import { StatsCardProps } from '../types';

const variantClasses: Record<string, string> = {
  default: 'text-gray-700',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-blue-600',
};

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, variant = 'default' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${variantClasses[variant]}`}>{value}</div>
    </div>
  );
};

export default StatsCard;