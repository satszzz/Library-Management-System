import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard = ({ book, index = 0, showActions = true }) => {
  const [imageError, setImageError] = useState(false);
  const isAvailable = book.availableCopies > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/books/${book.id}`}
        className="card card-hover group block overflow-hidden"
      >
        {/* Cover */}
        <div className="relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-800">
          {book.coverImage && !imageError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${book.coverGradient[0]}, ${book.coverGradient[1]})`,
              }}
            >
              <BookOpen size={40} className="text-white/40" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold">
              {book.category}
            </span>
          </div>

          {/* Wishlist hover button */}
          {showActions && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="w-8 h-8 rounded-full bg-white/90 dark:bg-surface-900/90 backdrop-blur-md flex items-center justify-center text-surface-400 hover:text-rose-500 transition-colors shadow-lg"
              >
                <Heart size={14} />
              </button>
            </div>
          )}

          {/* Availability */}
          <div className="absolute bottom-3 right-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-md ${
                isAvailable
                  ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                  : 'bg-rose-500/20 text-rose-100 border border-rose-400/30'
              }`}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 line-clamp-1">
            {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < Math.floor(book.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-surface-200 dark:text-surface-700'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-surface-400 font-medium">
              {book.rating}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
