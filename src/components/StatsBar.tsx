interface StatsBarProps {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}

export function StatsBar({ pending, inProgress, completed, total }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
        <p className="text-2xl font-bold text-gray-900">{total}</p>
        <p className="text-xs text-gray-500 mt-0.5">Total Tasks</p>
      </div>
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 shadow-sm text-center">
        <p className="text-2xl font-bold text-yellow-700">{pending}</p>
        <p className="text-xs text-yellow-600 mt-0.5">Pending</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm text-center">
        <p className="text-2xl font-bold text-blue-700">{inProgress}</p>
        <p className="text-xs text-blue-600 mt-0.5">In Progress</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 border border-green-100 shadow-sm text-center">
        <p className="text-2xl font-bold text-green-700">{completed}</p>
        <p className="text-xs text-green-600 mt-0.5">Completed</p>
      </div>
    </div>
  );
}