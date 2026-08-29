import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import BookCard from '../../components/common/BookCard';
import EmptyState from '../../components/common/EmptyState';
import { books } from '../../data/books';
import { categories } from '../../data/categories';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'newest', label: 'Newest First' },
];

const StudentBooks = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availability, setAvailability] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Availability
    if (availability === 'available') {
      result = result.filter((b) => b.availableCopies > 0);
    } else if (availability === 'unavailable') {
      result = result.filter((b) => b.availableCopies === 0);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        result.sort((a, b) => b.borrowCount - a.borrowCount);
    }

    return result;
  }, [search, selectedCategory, availability, sortBy]);

  const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBooks.length;

  const activeFilterCount = [selectedCategory, availability].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory('');
    setAvailability('');
    setSortBy('popular');
  };

  return (
    <div>
      <PageHeader
        title="Explore Books"
        subtitle={`${filteredBooks.length} books available to explore`}
      />

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            size="sm"
            placeholder="Search by title, author, or category..."
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary text-sm relative ${showFilters ? 'ring-2 ring-primary-500/30' : ''}`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="text-xs font-medium text-surface-500 mb-1.5 block">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="input text-sm pr-10 appearance-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-xs font-medium text-surface-500 mb-1.5 block">
                    Availability
                  </label>
                  <div className="relative">
                    <select
                      className="input text-sm pr-10 appearance-none"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    >
                      <option value="">All</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-xs font-medium text-surface-500 mb-1.5 block">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      className="input text-sm pr-10 appearance-none"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {selectedCategory && (
            <span className="badge-info">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('')}>
                <X size={12} />
              </button>
            </span>
          )}
          {availability && (
            <span className="badge-info">
              {availability === 'available' ? 'Available' : 'Unavailable'}
              <button onClick={() => setAvailability('')}>
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Book grid */}
      {visibleBooks.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleBooks.map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + 8)}
                className="btn-secondary text-sm"
              >
                Load More Books
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState preset="no-results" />
      )}
    </div>
  );
};

export default StudentBooks;
