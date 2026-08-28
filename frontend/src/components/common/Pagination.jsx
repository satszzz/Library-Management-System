import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) rangeWithDots.push(1, '...');
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) rangeWithDots.push('...', pages);
    else if (pages > 1) rangeWithDots.push(pages);

    return [...new Set(rangeWithDots)];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed text-surface-600 dark:text-surface-400 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((num, idx) => (
        <button
          key={idx}
          onClick={() => typeof num === 'number' && onPageChange(num)}
          disabled={num === '...'}
          className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
            num === page
              ? 'bg-primary-600 text-white shadow-sm'
              : num === '...'
              ? 'text-surface-400 cursor-default'
              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed text-surface-600 dark:text-surface-400 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
