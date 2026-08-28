import { Link } from 'react-router-dom';
import { BookOpen, Eye, ArrowRight, BookmarkCheck } from 'lucide-react';

const BookCard = ({ book, onIssue, onReserve, showActions = true }) => {
  const isAvailable = book.availableCopies > 0;
  const categoryName = book.category?.name || 'Uncategorized';

  return (
    <div className="card overflow-hidden group flex flex-col justify-between h-full hover:scale-[1.02] transition-all duration-300">
      {/* Cover Image Container */}
      <div>
        <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className={`${book.coverImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20`}>
            <BookOpen size={48} className="text-indigo-400 dark:text-indigo-500/60" />
          </div>

          {/* Stock Availability Badge */}
          <div className="absolute top-3 right-3">
            <span className={isAvailable ? 'badge-success shadow-md' : 'badge-danger shadow-md'}>
              <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isAvailable ? `${book.availableCopies} Available` : 'Unavailable'}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
              {categoryName}
            </span>
          </div>
        </div>

        {/* Info Body */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            by {book.author}
          </p>
          {book.publicationYear && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Published: {book.publicationYear}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="p-4 pt-0 flex items-center gap-2">
          <Link
            to={`/books/${book._id}`}
            className="flex-1 btn-secondary text-xs py-2 justify-center"
          >
            <Eye size={14} /> Details
          </Link>

          {isAvailable ? (
            <button
              onClick={() => onIssue && onIssue(book)}
              className="flex-1 btn-primary text-xs py-2 justify-center"
            >
              Issue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => onReserve && onReserve(book)}
              className="flex-1 btn-outline text-xs py-2 justify-center"
            >
              <BookmarkCheck size={14} /> Reserve
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
