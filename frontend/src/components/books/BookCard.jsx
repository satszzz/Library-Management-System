import { Link } from 'react-router-dom';
import { BookOpen, Eye } from 'lucide-react';

const BookCard = ({ book, onIssue, onReserve, showActions = true }) => {
  const isAvailable = book.availableCopies > 0;
  const categoryName = book.category?.name || 'Uncategorized';

  return (
    <div className="card overflow-hidden group hover:scale-[1.01] transition-all duration-300">
      {/* Cover Image */}
      <div className="relative h-52 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className={`${book.coverImage ? 'hidden' : 'flex'} absolute inset-0 items-center justify-center`}>
          <BookOpen size={48} className="text-primary-300 dark:text-primary-700" />
        </div>
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={isAvailable ? 'badge-success' : 'badge-danger'}>
            {isAvailable ? `${book.availableCopies} Available` : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-surface-900 dark:text-white line-clamp-1 text-sm">{book.title}</h3>
        </div>
        <p className="text-xs text-surface-500 dark:text-surface-400">{book.author}</p>
        <span className="badge-neutral text-[10px]">{categoryName}</span>

        {showActions && (
          <div className="pt-2 flex gap-2">
            <Link
              to={`/books/${book._id}`}
              className="flex-1 btn-secondary text-xs py-2 justify-center"
            >
              <Eye size={14} />
              Details
            </Link>
            {isAvailable ? (
              <button
                onClick={() => onIssue && onIssue(book)}
                className="flex-1 btn-primary text-xs py-2"
              >
                Issue
              </button>
            ) : (
              <button
                onClick={() => onReserve && onReserve(book)}
                className="flex-1 btn-outline text-xs py-2"
              >
                Reserve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
