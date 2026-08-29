import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { borrowedBooks, returnedBooks, wishlistBooks } from '../../data/user';
import { getBookById } from '../../data/books';

const tabs = [
  { key: 'borrowed', label: 'Currently Borrowed' },
  { key: 'returned', label: 'Returned' },
  { key: 'wishlist', label: 'Wishlist' },
];

const getDueStatus = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: 'Overdue', color: 'badge-danger' };
  if (daysLeft <= 3) return { label: 'Due Soon', color: 'badge-warning' };
  return { label: `${daysLeft} days left`, color: 'badge-success' };
};

const MyBooks = () => {
  const [activeTab, setActiveTab] = useState('borrowed');

  const data = {
    borrowed: borrowedBooks,
    returned: returnedBooks,
    wishlist: wishlistBooks,
  };

  const currentData = data[activeTab];

  return (
    <div>
      <PageHeader
        title="My Books"
        subtitle="Your personal library collection"
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 dark:bg-surface-900 p-1 rounded-xl mb-8 max-w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'text-slate-900 dark:text-white'
                : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="mybooks-tab"
                className="absolute inset-0 bg-white dark:bg-[#182235] rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {currentData.length === 0 ? (
        <EmptyState preset="no-books" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentData.map((item, i) => {
            const dueStatus =
              activeTab === 'borrowed' ? getDueStatus(item.dueDate) : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card card-hover p-5"
              >
                <div className="flex gap-4">
                  {/* Cover */}
                  <div className="w-16 h-22 rounded-xl flex-shrink-0 overflow-hidden shadow-md bg-surface-100 dark:bg-surface-800">
                    {getBookById(item.bookId)?.coverImage ? (
                      <img
                        src={getBookById(item.bookId).coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${item.coverGradient[0]}, ${item.coverGradient[1]})`,
                        }}
                      >
                        <BookOpen size={20} className="text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {item.author}
                    </p>

                    {/* Borrowed info */}
                    {(activeTab === 'borrowed' || activeTab === 'returned') && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-surface-400">
                          <Calendar size={12} />
                          <span>Borrowed: {new Date(item.borrowDate).toLocaleDateString()}</span>
                        </div>
                        {activeTab === 'borrowed' && (
                          <div className="flex items-center gap-1.5 text-xs text-surface-400">
                            <Clock size={12} />
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {activeTab === 'returned' && item.returnDate && (
                          <div className="flex items-center gap-1.5 text-xs text-surface-400">
                            <Clock size={12} />
                            <span>Returned: {new Date(item.returnDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Wishlist added date */}
                    {activeTab === 'wishlist' && (
                      <div className="flex items-center gap-1.5 text-xs text-surface-400 mt-2">
                        <Calendar size={12} />
                        <span>Added: {new Date(item.addedDate).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Status badge + action */}
                    <div className="flex items-center justify-between mt-3">
                      {dueStatus && (
                        <span className={dueStatus.color}>{dueStatus.label}</span>
                      )}
                      {activeTab === 'returned' && (
                        <span className="badge-success">Returned</span>
                      )}
                      <Link
                        to={`/books/${item.bookId}`}
                        className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 ml-auto"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </div>

                    {/* Progress bar for borrowed */}
                    {activeTab === 'borrowed' && item.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-surface-400">Progress</span>
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            {item.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
