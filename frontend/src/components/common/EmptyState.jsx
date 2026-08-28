import { BookX, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState = ({ icon: Icon = BookX, title = 'No results found', message = 'Try changing your search or filters.', action, actionLabel = 'Try Again' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
      <Icon size={36} className="text-surface-300 dark:text-surface-600" />
    </div>
    <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">{title}</h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">{message}</p>
    {action && (
      <button onClick={action} className="btn-primary mt-4">
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
      <AlertCircle size={36} className="text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">Error</h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary mt-4 gap-2">
        <RefreshCw size={16} />
        Try Again
      </button>
    )}
  </div>
);
