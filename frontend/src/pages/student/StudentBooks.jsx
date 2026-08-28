import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService, issueService, reservationService, categoryService } from '../../services/services';
import BookCard from '../../components/books/BookCard';
import Pagination from '../../components/common/Pagination';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', available: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetchBooks();
  }, [page, filters]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchBooks(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12, search };
      if (filters.category) params.category = filters.category;
      if (filters.available) params.available = filters.available;
      const { data } = await bookService.getBooks(params);
      setBooks(data.books);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {}
  };

  const handleIssue = async (book) => {
    try {
      await issueService.issueBook({ bookId: book._id });
      toast.success(`"${book.title}" issued successfully!`);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReserve = async (book) => {
    try {
      await reservationService.reserveBook({ bookId: book._id });
      toast.success(`"${book.title}" reserved successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reserve book');
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', available: '' });
    setSearch('');
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.available || search;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Book Catalog</h1>
        <p className="page-subtitle">Browse and discover books from our collection. {total} book(s) found.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary ${showFilters ? 'ring-2 ring-primary-500' : ''}`}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="flex rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2.5 ${view === 'grid' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-2.5 ${view === 'list' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800'}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 animate-slide-down">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[180px]">
              <label className="input-label">Category</label>
              <select className="input" value={filters.category} onChange={(e) => { setFilters({...filters, category: e.target.value}); setPage(1); }}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className="input-label">Availability</label>
              <select className="input" value={filters.available} onChange={(e) => { setFilters({...filters, available: e.target.value}); setPage(1); }}>
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>
            {hasActiveFilters && (
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-ghost text-sm text-red-500">
                  <X size={14} /> Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Books Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-48 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState title="No books found" message="Try changing your search or filters." action={clearFilters} actionLabel="Clear Filters" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onIssue={handleIssue} onReserve={handleReserve} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((book) => (
            <div key={book._id} className="card p-4 flex items-center gap-4 hover:shadow-card-hover cursor-pointer" onClick={() => navigate(`/books/${book._id}`)}>
              <div className="w-16 h-20 rounded-lg overflow-hidden bg-surface-100 dark:bg-surface-700 flex-shrink-0">
                {book.coverImage ? (
                  <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-300"><Search size={20} /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-surface-900 dark:text-white truncate">{book.title}</p>
                <p className="text-sm text-surface-500">{book.author}</p>
                <span className="badge-neutral text-[10px] mt-1">{book.category?.name}</span>
              </div>
              <span className={book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}>
                {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default StudentBooks;
