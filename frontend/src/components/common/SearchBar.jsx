import { Search, ArrowRight } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search books by title, author, or ISBN...',
  size = 'lg',
  className = '',
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const isLarge = size === 'lg';

  return (
    <div className={`relative group ${className}`}>
      <Search
        size={isLarge ? 20 : 18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors"
      />
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-[#263248] text-slate-900 dark:text-white shadow-lg shadow-surface-200/30 dark:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all ${
          isLarge
            ? 'pl-12 pr-36 py-4 rounded-2xl text-base'
            : 'pl-10 pr-4 py-2.5 rounded-xl text-sm'
        }`}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {isLarge && onSearch && (
        <button
          onClick={() => onSearch(value)}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-gradient px-5 py-2.5 text-sm"
        >
          Search <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
