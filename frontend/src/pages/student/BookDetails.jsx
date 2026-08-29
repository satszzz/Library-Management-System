import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Star,
  Heart,
  ArrowLeft,
  Calendar,
  Hash,
  Globe,
  Building,
  BookText,
  ChevronRight,
} from 'lucide-react';
import { getBookById, books } from '../../data/books';

const BookDetails = () => {
  const { id } = useParams();
  const book = getBookById(id);

  if (!book) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-surface-300 dark:text-surface-600 mb-4" />
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Book not found
          </h2>
          <Link to="/explore" className="btn-primary text-sm mt-4">
            <ArrowLeft size={16} /> Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const relatedBooks = books
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 4);

  const details = [
    { icon: Building, label: 'Publisher', value: book.publisher },
    { icon: Calendar, label: 'Year', value: book.year },
    { icon: BookText, label: 'Pages', value: book.pages },
    { icon: Globe, label: 'Language', value: book.language },
    { icon: Hash, label: 'ISBN', value: book.isbn },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400 mb-6">
        <Link to="/explore" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          Explore
        </Link>
        <ChevronRight size={14} />
        <span className="text-slate-900 dark:text-white font-medium truncate">
          {book.title}
        </span>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Book cover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 mx-auto lg:mx-0"
        >
          <div className="w-56 h-72 md:w-64 md:h-80 rounded-2xl shadow-2xl overflow-hidden bg-surface-100 dark:bg-surface-800">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})`,
                }}
              >
                <BookOpen size={56} className="text-white/30" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1"
        >
          {/* Category */}
          <span className="badge-info mb-3">{book.category}</span>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-lg text-surface-500 dark:text-surface-400 mb-4">
            by {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(book.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-surface-200 dark:text-surface-700'
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {book.rating}
            </span>
            <span className="text-sm text-surface-400">
              ({book.totalRatings.toLocaleString()} ratings)
            </span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                isAvailable
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
              }`}
            >
              {isAvailable
                ? `${book.availableCopies} of ${book.totalCopies} copies available`
                : 'Currently unavailable'}
            </span>
          </div>

          {/* Description */}
          <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-8">
            {book.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              className={`${
                isAvailable ? 'btn-gradient' : 'btn-secondary opacity-60 cursor-not-allowed'
              } px-8 py-3 text-base`}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Borrow Book' : 'Unavailable'}
            </button>
            <button className="btn-secondary px-6 py-3 text-base group">
              <Heart
                size={18}
                className="text-surface-400 group-hover:text-rose-500 transition-colors"
              />
              Add to Wishlist
            </button>
          </div>
        </motion.div>
      </div>

      {/* About this book */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card p-6 mb-8"
      >
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
          About this Book
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {details.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center flex-shrink-0">
                <d.icon size={16} className="text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-400 uppercase tracking-wide font-medium">
                  {d.label}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {d.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* You May Also Like */}
      {relatedBooks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedBooks.map((b, i) => (
              <Link
                key={b.id}
                to={`/books/${b.id}`}
                className="card card-hover overflow-hidden group block"
              >
                <div
                  className="h-36 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${b.coverGradient[0]}, ${b.coverGradient[1]})`,
                  }}
                >
                  <BookOpen size={28} className="text-white/40" />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-surface-400 mt-0.5">
                    {b.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookDetails;
